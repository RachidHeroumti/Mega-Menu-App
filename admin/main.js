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
    moduleData: [],
    showtoaddmenu: false,
    menuType: "",
    url: "/",
    name: "", // For item in simple type
    menuName: "",
    optionShow: "blank",
    placement: "",
    errorhint: {
      place:'defaul',
      text:'error!'},
  },
  computed: {
    filteredMenus() {
      return this.selectedMenu.filter(
        (item) => item.menuType === this.menuType
      );
    },
  },
  watch: {
    menuType(newType) {
      console.log(`menuType changed to: ${newType}`);
      this.updateMenuList();
      this.getModule();
      this.selectedMenu = [];
    },
  },
  methods: {
    validateFields(fields) {
      for (const [key, value] of Object.entries(fields)) {
        if (!value) {
          console.error(`Required field "${key}" is missing!`);
          return false;
        }
      }
      return true;
    },
    isDuplicateMenu(name, url) {
      return this.selectedMenu.some(
        (item) => item.name === name && item.url === url
      );
    },
    AddNewItem() {
      if (
        !this.validateFields({ name: this.name, url: this.url }) ||
        this.isDuplicateMenu(this.name, this.url)
      ) {
        return;
      }

      this.selectedMenu.push({
        type: "simple",
        title: this.name,
        optionShow: this.optionShow,
        url: this.url,
      });

      this.resetFields(["name", "url"]);
      console.log("Menu added successfully:", this.selectedMenu);
    },
    RemoveItemFromMenu(item) {
      this.selectedMenu = this.selectedMenu.filter((it) => it !== item);
    },
    updateMenuList() {
      this.selectedMenu = this.menus.filter(
        (item) => item.menuType === this.menuType
      );
    },
    async getModule() {
      let module = this.menuType ? this.menuType.toLowerCase() : "";

      if (!module || module === "simple") return;

      try {
        const params = {};
        if (module === "blogs") {
          module = "pages";
          params.type = "POST";
        } else if (module === "pages") {
          params.type = "PAGE";
        }

        const { data } = await http.get(`/api/${module}/search`, { params });
        this.moduleData = data.results;
        console.log("Module fetched successfully:", data.results);
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    },
    AddItemToMenuModule(slug) {
      if (!slug) {
        console.error("Invalid slug provided!");
        return;
      }
      if (this.selectedMenu.includes(slug)) {
        console.warn(`Slug "${slug}" is already in the menu!`);
        return;
      }

      this.selectedMenu.push({ title: slug });
      console.log(`Slug "${slug}" added successfully to the menu!`);
    },
    RemoveItemFromMenuModule(slug) {
      this.selectedMenu = this.selectedMenu.filter((item) => item !== slug);
    },
    OnSaveMenu() {

     this.errorhint.place='',
        this.errorhint.text=''

       
      if (
        !this.validateFields({ menuName: this.menuName }) ||
        this.selectedMenu.length === 0
      ) {
        this.errorhint.place='under_menu_name',
        this.errorhint.text='menu name is empty'
        return ;
      }

      this.menus.push({
        name: this.menuName,
        menu: this.selectedMenu,
        placement: this.placement || "HEADER",
        menu_type: this.menuType || "simple",
      });

      this.showtoaddmenu = false;
      console.log("Menus saved successfully:", this.menus);
    },
    DeleteMenu(menu){
      this.menus=this.menus.filter((item)=>{
        return item!==menu ;
      })
    },  
  EditMenu(menu){

}
  ,
    resetFields(fields) {
      fields.forEach((field) => (this[field] = ""));
    },
  },
});
