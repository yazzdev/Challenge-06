const { Suppliers, Components } = require('../models');

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
  }
};