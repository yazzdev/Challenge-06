const { Suppliers, Components, Products, product_components } = require('../models');

module.exports = {
  truncateSupplier: async () => {
    try {
      await Suppliers.destroy({ truncate: { cascade: true } });
    } catch (error) {
      console.error('Error truncating Suppliers table:', error);
    }
  },
  truncateComponent: async () => {
    try {
      await Components.destroy({ truncate: { cascade: true } });
    } catch (error) {
      console.error('Error truncating Components table:', error);
    }
  },
  truncateProduct: async () => {
    try {
      await Products.destroy({ truncate: { cascade: true } });
    } catch (error) {
      console.error('Error truncating Products table:', error);
    }
  },
  truncateProductComponents: async () => {
    try {
      await product_components.destroy({ truncate: { cascade: true } });
    } catch (error) {
      console.error('Error truncating product_components table:', error);
    }
  }
};