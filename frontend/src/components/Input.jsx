import PropTypes from 'prop-types';

const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-cyan-400' /> {/* Adjusted icon color to cyan for consistency */}
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-gray-900 bg-opacity-80 rounded-lg border border-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-500 transition duration-200'
			/>
		</div>
	);
};

Input.propTypes = {
	icon: PropTypes.elementType.isRequired, // Ensures icon is a valid component
};

export default Input;
