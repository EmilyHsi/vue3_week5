import productModal from './productModal.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/api';
const path = 'emilyhsivue3';

const app = Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  methods: {
    getProducts() {
      const api = `${apiUrl}/${path}/products`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
          } else {
            alert(res.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    openModal(item) {
      this.loadingStatus.loadingItem = item.id;
      const api = `${apiUrl}/${path}/product/${item.id}`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            this.product = res.data.product;
            this.loadingStatus.loadingItem = '';
            this.$refs.userProductModal.openModal();
          } else {
            alert(res.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    addCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty
      };
      const api = `${apiUrl}/${path}/cart`;
      axios.post(api, {
          data: cart
        })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    getCart() {
      const api = `${apiUrl}/${path}/cart`;
      axios.get(api)
        .then((res) => {
          if (res.data.success) {
            this.cart = res.data.data;
          } else {
            alert(res.data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    updateCart(item) {
      this.loadingStatus.loadingItem = item.id;
      const cart = {
        product_id: item.product.id,
        qty: item.qty,
      };
      const api = `${apiUrl}/${path}/cart/${item.id}`;
      axios.put(api, {
          data: cart
        })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
            this.getCart();
          } else {
            alert(res.data.message);
            this.loadingStatus.loadingItem = '';
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    clearCart() {
      const api = `${apiUrl}/${path}/carts`;
      axios.delete(api).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.getCart();
        } else {
          alert(res.data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    removeItem(id) {
      const api = `${apiUrl}/${path}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(api).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        } else {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    submit() {
      const api = `${apiUrl}/${path}/order`;
      const orderData = {
        user: this.form.user,
        message: this.form.message,
      };
      axios.post(api, {
        data: orderData,
      }).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = '';
          this.getCart();
        } else {
          alert(res.data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.component('userProductModal', productModal)
app.mount('#app');