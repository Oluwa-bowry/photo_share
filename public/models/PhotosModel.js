module.exports = (sequelize, DataTypes) => {
    const photos = sequelize.define(
        "photos", 
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            title: {
                type: DataTypes.STRING,
            },
            slug: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            medialocation: {
                type: DataTypes.STRING,
            }

        }
    )
    return photos
}