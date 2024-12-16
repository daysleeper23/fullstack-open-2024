import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async ({ context }: { context: QueryInterface}) => {
    const queryInterface = context;

    await queryInterface.createTable('session', {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,

      },
      sess: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE(6),
        allowNull: false
      }
    });

    await queryInterface.addColumn('users', 'enabled', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.addIndex('session', {
      fields: ['expire'],
      name: 'IDX_session_expire'
    });
  },
  down: async ({ context }: { context: QueryInterface }) => {
    const queryInterface = context;

    await queryInterface.removeIndex('session', 'IDX_session_expire');
    await queryInterface.removeColumn('users', 'enabled');
    await queryInterface.dropTable('session');
  }
};