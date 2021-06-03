import { api } from '~/assets/js/db';
import { FileStreamer } from '~/assets/js/fs';

export const state = () => ({
  loaded: false,
  inLoad: false,
  chunks: 0,
  current: 0,

  // Для файла размером в 10кк символов
  // получим примерно ~6.1мб чанки, такие что
  // в каждый чанк вместится целое число строк
  // p.s. для utf-8 в 1 октет
  // p.s для utf-8 в 2 и более октета нужно места в соответственное количество раз больше
  // т.к. файл сохраняется не линейно
  _chunkSize: 101*1064*1064/19,

  file: {
    name: '',
    size: '',
    type: '',
    chunks: '',
    loaded: false
  },

  searchLine: '',
  searchResult: 0

})

export const mutations = {

  FILE_LOADER_STATE_INCREMENTOR (state) {
    state.current++
    if (state.current >= state.chunks) {
      state.loaded = true
      state.file.loaded = true
      localStorage.setItem("file", JSON.stringify(state.file));
    }
  },

  INIT (state, { file }) {
    state.file = file
  },

  UPDATE_SEARCH_LINE (state, { text }) {
    state.searchLine = text
  },

  APPEND_SEARCH_RESULT (state, { value }) {
    state.searchResult += value
  },

  REFRESH_SEARCH_RESULT (state) {
    state.searchResult = 0
  },

  START_SEARCH (state) {
    const chunks = state.file.chunks
    state.searchResult = 0

    const startLoop = (chunks, state, store) => {
      const _chunks = chunks
      let _current = 1
      const _state = state
      let _store = store

      const  loopSearch = async () => {
        const item = await api.getItemFromObjectStore(_current)
        const res = item.chunk.split('\n')
        const res2 = res.filter(el => el.includesStart(_state.searchLine))
        _store.commit('fileProcessing/APPEND_SEARCH_RESULT', { value: res2.length }) 
        _current++
        if (_current !== _chunks+1) {
          setTimeout(loopSearch)
        }
      }
      loopSearch()
    }

    if (state.searchLine) {
      startLoop(chunks, state, this) 
    }
  },

  SET_CHUNK_SIZE (state, { size }) {
    state.chunks = size
  },

  CLEAR_FILE (state) {
    state.loaded = false
    state.inLoad = false
    state.chunks = false
    state.current = 0
    state.file = {
      name: '',
      size: '',
      type: '',
      chunks: '',
      loaded: false
    }
    localStorage.removeItem("file")
  },

  SET_INLOAD_STATE (state) {
    state.inLoad = true
  },

  SET_LOADED_STATE (state, { loaded }) {
    state.loaded = loaded
  },

  SET_FILE (state, { file }) {
    state.file = file
    localStorage.setItem("file", JSON.stringify(file));
  }
}

export const actions = {

  init ({ commit }) {
    const file = JSON.parse(localStorage.getItem("file"))

    if (file) {
      commit('INIT', { file: file })
      commit('SET_LOADED_STATE', { loaded: true })
    }
  },

  updateSearchLine ({ commit }, { text }) {
    commit('UPDATE_SEARCH_LINE', { text });

  },

  startSearch ({ commit }) {
    commit('START_SEARCH')
  },

  addChunkToDb({ text }) {
      return api.saveItem(text);
  },

  async getItems({ commit }) {
      let chunk = await api.getItem()
      commit('SET_CHUNK', chunk)
  },

  deleteFile({ commit }, { chunk }) {
      return api.deleteItem(chunk)
  },

  /**
   * 
   * @param {context} param0 
   * @param {File} param1 
   */
  loadFile ({ commit, state }, { files }) {
    
    if (!files.length) {
      $nuxt.$notify.toast( 'Пожалуйста, выберите файл', { color: 'error' } )
      return;
    }

    // $nuxt.$notify.toast('Начинаю загрузку данных!', { color: 'success' })
    const file = files[0];
    const fileStreamer = new FileStreamer(file, state._chunkSize);
    const fCopy = { 
      name: file.name,
      size: file.size,
      type: file.type,
      chunks: fileStreamer.getChunkSize(),
      loaded: false
    };
    const chunks = fileStreamer.getChunkSize();
    
    // Отправляю пересериализованный объект в commit чтобы не создавать лишних ссылок
    commit('SET_FILE', { file: JSON.parse(JSON.stringify(fCopy)) })
    commit('SET_CHUNK_SIZE', { size: chunks })
    commit('SET_INLOAD_STATE')

    const handler = async (data) => {
      await api.saveItem(data)
      commit('FILE_LOADER_STATE_INCREMENTOR');
    }
    fileStreamer.startLoop(handler);
  },

  clearStore ({ commit }) {
    api.clearObjectStore().then(result => {
      $nuxt.$notify.toast('Файл удален', { color: 'success' })
    });
    commit('CLEAR_FILE');
  }

}


export const getters = {
}
