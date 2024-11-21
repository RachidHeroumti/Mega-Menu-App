var vm = new StoreinoApp({
  el: "#app_mega_menu",
  data: {
    data: __DATA__, 
    menus: [],
    selectedMenu: [],
    collections: [],
    products: [],
    pages: [],
    blogs: [],
    showtoaddmenu: false,
    menuType: '', 
    url:'/',
    name:'',//for item in simple type
    menuName:'',
    optionShow:'blank',
    placement:'',
  },
  mounted() {
    this.getCollections();
  },
  computed: {
    
    filteredMenus() {
      return this.selectedMenu.filter((item) => item.menuType === this.menuType);
    },
  },
  watch: {
    menuType(newType) {
      console.log(`menuType changed to: ${newType}`);
      this.updateMenuList();
    },
  },
  methods: {
    AddNewItem() {
      if (!this.name || !this.url) {
        console.error("Required fields are missing!");
        return;
      }
      const menu = {
        type: "simple",
        title: this.name,
        optionShow: this.optionShow,
        url: this.url
      };

      const isDuplicate = this.selectedMenu.some(item => item.name === menu.name && item.url === menu.url);
      if (isDuplicate) {
        console.error("Duplicate menu item!");
        return;
      }
      this.selectedMenu.push(menu);
    this.url='';
    this.name='';
      console.log("Menu added successfully:", this.selectedMenu);
    },
    RemoveItemFromMenu(item){
      this.selectedMenu = this.selectedMenu.filter((it) => {
        return it != item;
      });
    },        
    updateMenuList() {
      this.selectedMenu = this.menus.filter((item) => item.menuType === this.menuType);
    },

    
    getCollections() {
      console.log("Fetching collections...");
      
    },
    getPages() {
      console.log("Fetching pages...");
      
    },
    getBlogs() {
      console.log("Fetching blogs...");
      
    },
    getProducts() {
      console.log("Fetching products..."); 
    },
  },
});
