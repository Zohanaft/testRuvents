import { api } from '~/assets/js/db';
import { FileStreamer } from '~/assets/js/fs';

export const state = () => ({
  loaded: false,
  inLoad: false,
  chunks: false,
  progress: 0,
  current: 0,
})

export const mutations = {

  FILE_LOADER_STATE_INCREMENTOR (state) {
    state.current++
  },

  SET_CHUNK_SIZE (state, { size }) {
    state.chunks = size
  },

  CLEAR_FILE (state) {
    state.loaded = false
    state.inLoad = false
    state.chunks = false
    state.progress = 0
    state.current = 0
  }
}

export const actions = {
  addChunkToDb({ commit }, { text }) {
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

    $nuxt.$notify.toast('Начинаю загрузку данных!', { color: 'success' })
    
    const file = files[0];
    const fileStreamer = new FileStreamer(file);
    const chunks = fileStreamer.getChunkSize();

    commit('SET_CHUNK_SIZE', { size: chunks })

    const handler = async (data, chunks, total) => {
      await api.saveItem(data).then(result => {
        commit('FILE_LOADER_STATE_INCREMENTOR');
      })
    }
    fileStreamer.startLoop(handler);
  },

  clearStore () {
    api.clearObjectStore().then(result => {
      $nuxt.$notify.toast('Файл удален', { color: 'success' })
    });
    commit('CLEAR_FILE');
  }

}


export const getters = {
}
