import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../../../components/common/Card/Card';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import { showToast } from '../../../utils/helpers/toast';
import { formConfig } from '../../config/formConfig';
import { validateForm } from '../../../utils/schemas/authSchemas';

const DynamicForm = ({
  formType,
  onSubmit,
  loading = false,
  errors = {},
  successMessage = '',
  additionalProps = {},
}) => {
  const config = formConfig[formType] || {};
  const initialValues = config.fields?.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, 'success');
    }
  }, [successMessage]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const errorMessage = errors.message || 'An error occurred';
      showToast(errorMessage, 'error');
      setFormErrors(errors); // Merge server-side errors with form errors
    }
  }, [errors]);

  useEffect(() => {
    // Validate the entire form to determine if it's valid for submission
    const validationErrors = validateForm(formType, formData);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formData, formType]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate the changed field
    const fieldData = { ...formData, [name]: value };
    const validationErrors = validateForm(formType, fieldData);
    setFormErrors(prev => ({
      ...prev,
      [name]: validationErrors[name] || '',
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validateForm(formType, formData);
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors on submit:', validationErrors); // Debug log
      setFormErrors(validationErrors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="p-6 w-full max-w-md">
      {additionalProps.title && (
        <h2 className="text-2xl font-bold mb-4 text-center">{additionalProps.title}</h2>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {config.fields?.map(field => (
          <Input
            key={field.name}
            id={field.name}
            name={field.name}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            value={formData[field.name]}
            onChange={handleChange}
            error={formErrors[field.name] || errors[field.name]}
          />
        ))}
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={loading || !isFormValid}
          className="mt-2"
        >
          {loading ? <Spinner size="small" /> : config.submitButtonText}
        </Button>
      </form>
      {config.additionalLinks?.map((link, index) => (
        <p key={index} className="mt-4 text-center text-sm">
          <a href={link.href} className="text-primary hover:underline">
            {link.text}
          </a>
        </p>
      ))}
    </Card>
  );
};

DynamicForm.propTypes = {
  formType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.object,
  successMessage: PropTypes.string,
  additionalProps: PropTypes.object,
};

export default DynamicForm;
