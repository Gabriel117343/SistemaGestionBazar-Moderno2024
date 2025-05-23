import { create } from 'zustand'
import { getAllCategorias } from '../../api/categorias.api'
const useCategoriaStore = create((set) => ({
  categorias: [],
  geAllCategoriasStore: async () => {
    try {

      const res = await getAllCategorias()
      console.log(res)
      if (res.status === 200) {
        set({ categorias: res.data.data })
        return ({ success: true, message: res.data.message })
      } else if (res.status === 204) {
        // cuando no hay contenido en la respuesta es el status 204
        return ({ success: false, message: res.data.message })
      }
      return ({ success: false, message: res.data.error })
 
    } catch (error) {
      return ({ success: false, message: error.response.data.error })
    }
  }
}))
export default useCategoriaStore