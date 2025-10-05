import React, { memo } from 'react';

const ControlButton = memo(({
  icon: Icon,
  label,
  title,
  onClick,
  disabled = false,
  active = false,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500';
      default:
        return active 
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 focus:ring-blue-500'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'text-lg p-1.5';
      case 'large':
        return 'text-2xl p-3';
      default:
        return 'text-xl p-2';
    }
  };

  const handleClick = (e) => {
    console.log('🔘 Button clicked:', {
      label,
      disabled,
      hasOnClick: !!onClick,
      onClickType: typeof onClick
    });
    
    if (disabled) {
      console.log('❌ Button is disabled, ignoring click');
      return;
    }
    
    if (onClick) {
      console.log('✅ Calling onClick handler');
      onClick(e);
    } else {
      console.log('❌ No onClick handler provided');
    }
  };

  return (
    <button
      className={`
        focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full transition-all duration-200
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      {...props}
    >
      <Icon />
    </button>
  );
});

ControlButton.displayName = 'ControlButton';

export default ControlButton;
