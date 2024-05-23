/**
 * Yup schemas for a React query infinite hook data.
*/

import * as y from "yup";

export const ReactQueryPageSchema = y.object().shape({
    pages: y.array().required(),
    pageParams: y.array().required(),
});
