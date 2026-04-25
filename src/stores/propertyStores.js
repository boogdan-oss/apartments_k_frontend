import { defineStore } from 'pinia'

export const usePropertyStore = defineStore('property', {
  state: () => {
    // 1. ЗАВАНТАЖЕННЯ: При старті додатку перевіряємо localStorage
    const savedListings = localStorage.getItem('my_properties')
    
    // Якщо там щось є - розшифровуємо з JSON. Якщо ні - ставимо базовий масив (для прикладу)
    const initialListings = savedListings 
      ? JSON.parse(savedListings) 
      : [
          { id: 1, title: 'Затишна студія', price: '18 968 ₴', city: 'Київ', type: 'Студія', rating: 4.8, img: '...' },
          // ... ваші інші дефолтні квартири
        ]

    return {
      listings: initialListings,
      likedIds: [] // (сюди теж можна додати localStorage за бажанням)
    }
  },
  
  actions: {
    // Функція для додавання нової квартири
    addProperty(newProperty) {
      // Створюємо унікальний ID для нової квартири
      const newId = this.listings.length > 0 ? Math.max(...this.listings.map(p => p.id)) + 1 : 1;
      
      const propertyToAdd = {
        ...newProperty,
        id: newId,
        rating: 0 // Дефолтний рейтинг для нових
      }

      // Додаємо в масив
      this.listings.push(propertyToAdd)

      // 2. ЗБЕРЕЖЕННЯ: Одразу записуємо оновлений масив у localStorage
      this.saveToLocalStorage()
    },

    // Окрема допоміжна функція для збереження, щоб не писати один і той самий код
    saveToLocalStorage() {
      // localStorage розуміє тільки текст, тому перетворюємо масив у JSON-рядок
      localStorage.setItem('my_properties', JSON.stringify(this.listings))
    }
  }
})