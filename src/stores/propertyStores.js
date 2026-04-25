import { defineStore } from 'pinia'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    // Масив з нашими існуючими квартирами (я скоротив його для прикладу, залиште свої дані)
    listings: [
      { id: 1, title: 'Затишна студія', city: 'Київ', type: 'Студія', text: 'Сучасний ремонт.', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', rating: '4.83', price: '₴18 968 за 2 ночі', ownerName: 'Адміністратор', ownerPhone: '+380000000000' }
      // ... інші ваші квартири
    ]
  }),
  getters: {
    getAllListings: (state) => state.listings
  },
  actions: {
    // НОВА ФУНКЦІЯ: Додавання оголошення
    addListing(newListing) {
      // Створюємо унікальний ID для нової квартири
      const newId = this.listings.length > 0 ? Math.max(...this.listings.map(l => l.id)) + 1 : 1;
      
      // Додаємо нову квартиру на ПОЧАТОК масиву (щоб вона була першою в списку)
      this.listings.unshift({
        id: newId,
        ...newListing,
        rating: 'Нове' // Для нових квартир ще немає рейтингу
      });
    }
  }
})