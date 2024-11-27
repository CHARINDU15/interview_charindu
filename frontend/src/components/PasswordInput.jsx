import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Lock, Eye, EyeOff } from "lucide-react"; // Import icons for showing/hiding password

const PasswordInput = ({ value, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
    };

    return (
        <div className='relative mb-6'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Lock className='size-5 text-cyan-400' />
            </div>
            <input
                type={isVisible ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                placeholder='Password'
                className='w-full pl-10 pr-10 py-2 bg-gray-900 bg-opacity-80 rounded-lg border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition duration-200'
            />
            <button
                type='button'
                onClick={toggleVisibility}
                className='absolute right-3 top-2 text-cyan-400'
            >
                {isVisible ? <EyeOff /> : <Eye />}
            </button>
        </div>
    );
};

// Define prop types
PasswordInput.propTypes = {
    value: PropTypes.string.isRequired, // Specifies that value is a required string
    onChange: PropTypes.func.isRequired, // Specifies that onChange is a required function
};

export default PasswordInput;
