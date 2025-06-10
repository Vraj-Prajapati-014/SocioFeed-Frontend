import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
  // Memoize initialValues to prevent it from being recreated on every render
  const initialValues = useMemo(
    () =>
      config.fields?.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {}) || {},
    [config.fields]
  );

  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Debug logs for props that might cause re-renders
  useEffect(() => {
    console.log('DynamicForm - Props changed:', { successMessage, errors, formType });
  }, [successMessage, errors, formType]);

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, 'success');
      setHasSubmitted(false);
      setFormData(initialValues);
      setFormErrors({});
    }
  }, [successMessage, initialValues]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0 && hasSubmitted) {
      const errorMessage = errors.message || 'An error occurred';
      showToast(errorMessage, 'error');

      const newFormErrors = {};
      if (errors.details) {
        errors.details.forEach(({ field, message }) => {
          newFormErrors[field] = message;
        });
      } else if (errors.field) {
        newFormErrors[errors.field] = errors.message;
      } else {
        newFormErrors.general = errorMessage;
      }
      setFormErrors(newFormErrors);
    }
  }, [errors, hasSubmitted]);

  useEffect(() => {
    const validationErrors = validateForm(formType, formData);
    setIsFormValid(Object.keys(validationErrors).length === 0);
    // Debug log to trace validation
    console.log('DynamicForm - Validation useEffect:', { formData, validationErrors, isFormValid });
  }, [formData, formType]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Debug log to trace input changes
    console.log('DynamicForm - handleChange:', { name, value, hasSubmitted });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setHasSubmitted(true);
    const validationErrors = validateForm(formType, formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    setFormErrors({});
    onSubmit(formData);
  };

  return (
    <Card className="p-6 w-full">
      {additionalProps.title && (
        <h2 className="text-2xl font-bold mb-4 text-center text-white">{additionalProps.title}</h2>
      )}
      {formErrors.general && (
        <p className="text-red-500 text-sm text-center mb-4">{formErrors.general}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {config.fields?.map(field => (
          <Input
            key={field.name}
            id={field.name}
            name={field.name}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            error={formErrors[field.name] || ''}
            className="text-gray-300 placeholder-gray-400"
          />
        ))}
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={loading}
          className="mt-2 bg-gray-600 hover:bg-gray-700 text-white"
        >
          {loading ? <Spinner size="small" /> : config.submitButtonText}
        </Button>
      </form>
      {config.additionalLinks?.map((link, index) => (
        <p key={index} className="mt-4 text-center text-sm">
          <Link to={link.href} className="text-purple-400 hover:underline">
            {link.text}
          </Link>
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