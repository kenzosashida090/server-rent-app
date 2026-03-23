import { createPropertyDB, getPropertiesDB, getPropertyDB } from "../service/propertyService.js";
export const getProperties = async (req, res) => {
    try {
        const properties = await getPropertiesDB(req.query);
        if (properties) {
            res.status(202).json(properties);
        }
        else {
            res.status(404).json({ message: "Properties not found" });
        }
    }
    catch (error) {
        res.status(505).json({ message: `Error retrieving Properties: ${error.message}` });
    }
};
export const getProperty = async (req, res) => {
    try {
        const { id } = req.query;
        const property = await getPropertyDB(String(id));
        if (property) {
            res.status(202).json(property);
        }
        else {
            res.status(404).json({ message: "Property not found" });
        }
    }
    catch (error) {
        res.status(505).json({ message: `Error retrieving Property: ${error.message}` });
    }
};
export const createProperty = async (req, res) => {
    try {
        const files = req.files;
        const property = await createPropertyDB(req.body, files);
        if (property) {
            res.status(202).json(property);
        }
        else {
            res.status(404).json({ message: "Error creating property" });
        }
    }
    catch (error) {
        res.status(505).json({ message: `Error retrieving Property: ${error.message}` });
    }
};
//# sourceMappingURL=propertyControllers.js.map