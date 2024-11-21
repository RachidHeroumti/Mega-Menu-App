
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
    name: "", //for item in simple type
    menuName: "",
    optionShow: "blank",
    placement: "",
  },
  mounted() {},
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
    AddNewItem() {
      if (!this.name || !this.url) {
        console.error("Required fields are missing!");
        return;
      }
      const menu = {
        type: "simple",
        title: this.name,
        optionShow: this.optionShow,
        url: this.url,
      };

      const isDuplicate = this.selectedMenu.some(
        (item) => item.name === menu.name && item.url === menu.url
      );
      if (isDuplicate) {
        console.error("Duplicate menu item!");
        return;
      }
      this.selectedMenu.push(menu);
      this.url = "";
      this.name = "";
      console.log("Menu added successfully:", this.selectedMenu);
    },
    RemoveItemFromMenu(item) {
      this.selectedMenu = this.selectedMenu.filter((it) => {
        return it != item;
      });
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
        let params = {};

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
      if (!Array.isArray(this.selectedMenu)) {
        console.error("selectedMenu is not defined or not an array!");
        return;
      }

      if (this.selectedMenu.includes(slug)) {
        console.warn(`Slug "${slug}" is already in the menu!`);
        return;
      }
      const menu = {
        title: slug,
      };
      this.selectedMenu.push(menu);

      console.log(`Slug "${slug}" added successfully to the menu!`);
    },
    RemoveItemFromMenuodule(slug) {
      this.selectedMenu = this.selectedMenu.filter((item) => {
        return item != slug;
      });
    },
    OnSaveMenu() {
      if (!this.selectedMenu || this.selectedMenu.length === 0) {
        console.error("Cannot save menu: No items in the selected menu!");
        return;
      }

      if (!this.menuName) {
        console.error("Cannot save menu: menu name is missing!");
        return;
      }

      const menu = {
        name:this.menuName,
        menu: this.selectedMenu,
        placement: this.placement?this.placement:'HEADER',
        menu_type: this.menuType?this.menuType:'simple',
      };
      console.log("🚀 ~ OnSaveMenu ~ menu:", menu) ;
      
      if (!Array.isArray(this.menus)) {
        console.error(
          "Cannot save menu: 'menus' is not defined or not an array!"
        );
        return;
      }

      this.menus.push(menu);
      this.showtoaddmenu=false;
      console.log("Menus:", this.menus);
    },
  },
});
