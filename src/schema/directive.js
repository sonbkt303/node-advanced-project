import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
export const upperDirectiveTransformer = (schema, directiveName) => {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const upperDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      // console.log("upperDirectiveTransformer.upperDirective", upperDirective, directiveName)

      if (upperDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // console.log("upperDirectiveTransformer.fieldConfig", fieldConfig)

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);

          // console.log("result", result)

          // console.log("upperDirective", upperDirective, result, directiveName)

          if (typeof result === "string") {
            return result.toUpperCase();
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
};

const getUserFn = (token = "") => {
  return { hasRole: (role) => Boolean(role) };
};

export const authDirectiveTransformer = (schema, directiveName) => {
  const typeDirectiveArgumentMaps = {};

  return mapSchema(schema, {
    // [MapperKind.FIELD]: (type) => {
    //   const authDirective = getDirective(schema, type, directiveName)?.[0];

    //   if (authDirective) {
    //     typeDirectiveArgumentMaps[type.name] = authDirective;
    //   }
    //   return undefined;
    // },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const authDirective =
        getDirective(schema, fieldConfig, directiveName)?.[0] ??
        typeDirectiveArgumentMaps[typeName];

      if (authDirective) {
        const { requires } = authDirective;
        console.log("require", authDirective)
        if (requires) {
          
          // console.log("defaultFieldResolver", fieldConfig)
          const { resolve = defaultFieldResolver } = fieldConfig;

          fieldConfig.resolve = async function (source, args, context, info) {

            const result = await resolve(source, args, context, info);

            const userRoles = getUserFn(context.token);

            if (!userRoles.hasRole(requires)) {
              throw new Error("not authorized");
            }

            return result;
            // return resolve(source, args, context, info);
          };
          return fieldConfig;
        }
      }
    },
  });
};
