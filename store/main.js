const vm = new StoreinoApp({
  el: "#app_mega_menu",
  data: {
    data: __DATA__,
    menus: [],
    collections: [],
    products: [],
    pages: [],
    blogs: [],
    moduleData: [],
    HoverItem: null,
    hoverTimeout: null,
  },
  async mounted() {
    this.menus = this.data[0];
  },
  methods: {
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
    async getCollectionBySlug(slug) {
      try {
        const response = await http.get("/api/collections/search", {
          params: { slug },
        });
        this.collections = response?.data?.results || [];
      } catch (error) {
        console.error("Error fetching collections:", error);
        this.collections = [];
      }
    },

    NavigateTo(url) {
      console.log("Navigating to URL:", url);
      if (url) {
        window.location.href = url;
      } else {
        console.warn("URL is empty or undefined");
      }
      
    },
    handleMouseEnter(index) {
      clearTimeout(this.hoverTimeout);
      this.HoverItem = index;
    },
    handleMouseLeave() {
      this.hoverTimeout = setTimeout(() => {
        this.HoverItem = null;
      }, 200); 
    },
    
    svg(name) {
      const icons = {
        edit: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M80 0v-160h800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/></svg>',
        delete:
          '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>',
        add: '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>',
        open: '<svg xmlns="http://www.w3.org/2000/svg"  height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="m280-400 200-200 200 200H280Z"/></svg>',
        close:
          '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M480-360 280-560h400L480-360Z"/></svg>',
        direction:
          '<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>',
      };
      return icons[name] || "";
    },
  },
});
