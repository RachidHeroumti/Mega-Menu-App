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
    isCollectionOpen: false,  
    isPagesOpen: false,       
    isBlogsOpen: false,
  
    AddSimpleItem:false,
    url: "/",
    name: "",
    menuName: "",
    optionShow: "blank",
    placement: "",
    errorhint: {
      place: "default",
      text: "error!",
    },
    DesignType : '' ,
  },
  components: {
    draggable: window.vuedraggable // Registering directly in components
  },
  computed: {
  },
  watch: {
   
  },
  mounted(){
    this.getModules();
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
    isDuplicateMenu(name, url, menuList = this.selectedMenu) {
      for (const item of menuList) {
        if (item.slug === name || item.url === url) {
          return true;
        }
        if (item.children && item.children.length > 0) {
          if (this.isDuplicateMenu(name, url, item.children)) {
            return true;
          }
        }
      }
      return false;
    },
    toggleSection(section) {
      if (section === 'collections') {
        this.isCollectionOpen = !this.isCollectionOpen;
      } else if (section === 'pages') {
        this.isPagesOpen = !this.isPagesOpen;
      } else if (section === 'blogs') {
        this.isBlogsOpen = !this.isBlogsOpen;
      }
    },
  
    RemoveItemFromMenu(itemToRemove, parentList = this.selectedMenu) {
      for (let i = 0; i < parentList.length; i++) {
        const item = parentList[i];
        if (item === itemToRemove) {
          parentList.splice(i, 1); // Remove item
          return;
        }
        if (item.children && item.children.length > 0) {
          this.RemoveItemFromMenu(itemToRemove, item.children); // Check nested children
        }
      }
    },
    AddNewItem(slug, url = "/", type, parentItem = null) {
      if (!this.validateFields({ name: slug })) {
        return;
      }

      const newItem = {
        type,
        slug,
        url,
        children: [],
      };

      if (parentItem) {
        parentItem.children.push(newItem); // Add as a child of the parent
      } else {
        this.selectedMenu.push(newItem); // Add at the root level
      }

      this.resetFields(["name", "url"]);
      console.log("Menu added successfully:", this.selectedMenu);
    },
    async getModules() {
      try {
        // Define module configurations
        const modulesConfig = [
          { key: "collections", module: "collections", params: {} },
          { key: "blogs", module: "pages", params: { type: "POST" } },
          { key: "pages", module: "pages", params: { type: "PAGE" } },
        ];
    
        // Fetch all modules
        const moduleRequests = modulesConfig.map(({ module, params }) =>
          http.get(`/api/${module}/search`, { params })
        );
    
        const results = await Promise.all(moduleRequests);
    
        // Populate the data
        this.collections = results[0]?.data?.results || [];
        this.blogs = results[1]?.data?.results || [];
        this.pages = results[2]?.data?.results || [];
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    },
    OnSaveMenu() {
      this.errorhint = { place: "", text: "" };

      if (
        !this.validateFields({ menuName: this.menuName }) ||
        this.selectedMenu.length === 0
      ) {
        this.errorhint = {
          place: "under_menu_name",
          text: "menu name is empty",
        };
        return;
      }

      this.menus.push({
        name: this.menuName,
        menu: this.selectedMenu,
        placement: this.placement || "HEADER",
        type:this.DesignType||'simple',
      });

      this.showtoaddmenu = false;
      console.log("Menus saved successfully:", this.menus);
      this.selectedMenu = [];
    },
    DeleteMenu(menu) {
      this.menus = this.menus.filter((item) => item !== menu);
    },
    EditMenu(menu) {
      console.log("menu to edit", menu);
      this.selectedMenu = menu.menu;
      this.menuName = menu.name;
      this.DesignType = menu.DesignType;
      this.placement = menu.placement;
      this.showtoaddmenu = true;
    },
    resetFields(fields) {
      fields.forEach((field) => (this[field] = ""));
    },
    svg(name) {
      const icons = {
        'edit':'<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/></svg>', 
        'delete':'<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>',
        'add':'<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>',
        'open':'<svg xmlns="http://www.w3.org/2000/svg"  height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="m280-400 200-200 200 200H280Z"/></svg>',
        'close':'<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M480-360 280-560h400L480-360Z"/></svg>'
      };
      return icons[name] || '';
    },
    onDragEnd(evt) {
      console.log("Drag ended. Updated structure:", this.selectedMenu);
    },
  },
});
