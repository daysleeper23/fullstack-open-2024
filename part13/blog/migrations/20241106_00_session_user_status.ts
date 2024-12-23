import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async ({ context }: { context: QueryInterface}) => {
    const queryInterface = context;

    await queryInterface.addColumn('users', 'enabled', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

  },
  down: async ({ context }: { context: QueryInterface }) => {
    const queryInterface = context;

    await queryInterface.removeColumn('users', 'enabled');
  }
};