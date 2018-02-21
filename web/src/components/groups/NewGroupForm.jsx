import React from "react";
import { Field, reduxForm } from "redux-form";

let NewGroupForm = props => {
  const { handleSubmit } = props;
  return (<form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name of Group</label>
              <Field name="name" component="input" type="text" />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <Field name="description" component="input" type="text" />
            </div>
            <div>
              <label>Who Can Join?</label>
              <div>
                <label>
                  <Field name="public" component="input" type="radio" value="public" />
                  {" "}
                  Public
                </label>
                <label>
                  <Field name="public" component="input" type="radio" value="private" />
                  {" "}
                  Private
                </label>
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>);
};

NewGroupForm = reduxForm({
  // a unique name for the form
  form: "contact",
  initialValues: { public: "public" }
})(NewGroupForm);

export default NewGroupForm;
