const Joi = require('joi');

const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    sku: Joi.string().required(),
    price: Joi.number().min(0).required(),
    discountPercentage: Joi.number().min(0).max(100).default(0),
    stockCount: Joi.number().min(0).required(),
    categories: Joi.array().items(Joi.string()),
    variants: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        sku: Joi.string().required(),
        additionalCost: Joi.number().default(0),
        stockCount: Joi.number().min(0).required(),
      })
    ),
    attributes: Joi.object(),
    isActive: Joi.boolean().default(true),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    next(new Error(error.details[0].message));
    return;
  }
  next();
};

const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    parent: Joi.string().allow(null, ''),
    isActive: Joi.boolean().default(true),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400);
    next(new Error(error.details[0].message));
    return;
  }
  next();
};

module.exports = { validateProduct, validateCategory };