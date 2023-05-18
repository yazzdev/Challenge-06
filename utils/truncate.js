const { Suppliers } = require('../models');

module.exports = {
  truncateSupplier : async () => {
    try {
      await Suppliers.destroy({ truncate: { cascade: true }, restartIdentity: true });
      console.log('Suppliers table truncated successfully.');
    } catch (error) {
      console.error('Error truncating Suppliers table:', error);
    }
  }
};