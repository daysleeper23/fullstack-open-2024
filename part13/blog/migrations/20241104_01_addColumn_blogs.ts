import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async ({ context }: { context: QueryInterface }) => {
    const queryInterface = context;
    
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear(),
      validate: {
        min: 1991,
        max: new Date().getFullYear()
      }
    })
  },
  down: async ({ context }: { context: QueryInterface }) => {

    const queryInterface = context;
    await queryInterface.removeColumn('blogs', 'year');
  },
}