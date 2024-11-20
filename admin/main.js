var vm = new StoreinoApp({
    el: "#App_mega_menu",
    data: {
      data: __DATA__,
      menus: [],
      collections:  [],
      products: [],
      pages: [],
      blogs: [],
      showtoaddmenu:false,
    },
    mounted() {
      this.searchProducts();
    },
    computed: {
      filteredAvailableCountries() {
        const searchAvailableCountries =
          this.searchAvailableCountries.toLowerCase();
        return this.data.availableCountries.filter((country) =>
          country.name.toLowerCase().includes(searchAvailableCountries)
        );
      },
      filteredBlockedCountries() {
        const searchBlockedCountries = this.searchBlockedCountries.toLowerCase();
        return this.data.blockedCountries.filter((country) =>
          country.name.toLowerCase().includes(searchBlockedCountries)
        );
      },
      filteredAvailableProducts() {
        return this.availableProducts.filter(product =>
          product.name.toLowerCase().includes(this.availableSearchTerm.toLowerCase())
        );
      },
      filteredBlockedProducts() {
        return this.blockedProducts.filter(product =>
          product.name.toLowerCase().includes(this.blockedSearchTerm.toLowerCase())
        );
      },
    },
    methods: {
      showContent(contentType) {
        this.currentContent = contentType;
      },
      addAllToBlocked() {
        if (this.data.availableCountries.length > 0) {
          this.data.blockedCountries = [...this.data.blockedCountries,...this.data.availableCountries,];
          this.data.availableCountries = [];
        }
      },
      addAllToAvailable() {
        if (this.data.blockedCountries.length > 0) {
          this.data.availableCountries = [...this.data.availableCountries,...this.data.blockedCountries,];
          this.data.blockedCountries = [];
        }
      },
      moveSelectedAvailableCountries() {
        if (this.selectedAvailableCountries.length > 0) {
          this.data.blockedCountries = [...this.data.blockedCountries,...this.selectedAvailableCountries,];
          this.data.availableCountries = this.data.availableCountries.filter((country) => !this.selectedAvailableCountries.includes(country));
          this.selectedAvailableCountries = [];
        }
      },
      moveSelectedBlockedCountries() {
        if (this.selectedBlockedCountries.length > 0) {
          this.data.availableCountries = [...this.data.availableCountries,...this.selectedBlockedCountries,];
          this.data.blockedCountries = this.data.blockedCountries.filter((country) => !this.selectedBlockedCountries.includes(country));
          this.selectedBlockedCountries = [];
        }
      },
      async searchProducts() {
        try {
          const { results } = await StoreinoApp.$store.search("products");
          this.availableProducts = results;
          this.blockedProducts = this.data.blockedProducts.map((blockedProduct) => {
              const searchProducts = this.availableProducts.find((availableProduct) => availableProduct && availableProduct._id === blockedProduct.idProduct);
              if (searchProducts) {
                this.availableProducts = this.availableProducts.filter((product) => product && product._id !== searchProducts._id);
              }
              return searchProducts;
            }
          );
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      addSelectedProducts() {
        if (this.data.enableBlockProducts) {
          const selectedProducts = this.availableProducts.filter((product) => product.selectedAvailableProducts);
          if (selectedProducts.length > 0) {
            selectedProducts.forEach((selectedProduct) => {
              this.blockedProducts.unshift(selectedProduct);
              this.availableProducts = this.availableProducts.filter((product) => product._id !== selectedProduct._id);
              const idProduct = { idProduct: selectedProduct._id };
              this.data.blockedProducts.push(idProduct);
            });
          }
        }
      },
      removeSelectedProducts() {
        if (this.data.enableBlockProducts) {
          const selectedProducts = this.blockedProducts.filter((product) => product.selectedBlockedProducts);
          if (selectedProducts.length > 0) {
            selectedProducts.forEach((selectedProduct) => {
              const productId = selectedProduct._id;
              this.data.blockedProducts = this.data.blockedProducts.filter((blockedProduct) => blockedProduct.idProduct !== productId);
              const productIndex = this.blockedProducts.findIndex((product) => product._id === productId);
              if (productIndex !== -1) {
                this.blockedProducts = [...this.blockedProducts.slice(0, productIndex),...this.blockedProducts.slice(productIndex + 1),];
              }
              this.availableProducts.unshift({...selectedProduct, selectedBlockedProducts: false,});
            });
          }
        }
      },
      clearBlockedProducts() {
          if (!this.data.enableBlockProducts) {
            this.data.blockedProducts = [];
            this.blockedProducts = [];
            this.searchProducts();
          }
      },
      //functions
      getCollections(){

      },
      getPages(){

      },
      getBlogs(){

      },
      getProducts(){

      }
    },
  });