import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const BackgroundRemoval: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [croppedImageUrl] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cropper, setCropper] = useState<any>(null);
    const [selectedSize, setSelectedSize] = useState<string>('1080x1080'); // Default size 1080x1080

    const sizes = [
        { label: '1080x1080', value: '1080x1080' },
    ];

    const handleBackgroundRemoval = async (file: File) => {
        setLoading(true); // Start loading

        const formData = new FormData();
        formData.append("image_file", file);

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': '2Jpx1TyyQdDamxJ5PLpExfZi', // Replace with your API key
                },
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageUrl(url); // Update the image URL state
            } else {
                console.error('Error removing background');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleBackgroundRemoval(file);
        }
    };

    const handleSaveImage = () => {
        if (croppedImageUrl) {
            const link = document.createElement('a');
            link.href = croppedImageUrl;
            link.download = 'processed-image.png'; // You can change the file name
            link.click();
        } else if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'processed-image.png'; // You can change the file name
            link.click();
        }
    };



    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSize(event.target.value);
        if (cropper) {
            const [width, height] = event.target.value.split('x').map(Number);
            cropper.setAspectRatio(width / height); // Keep the selected aspect ratio
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-900">Background Removal</h2>
            <p className="text-gray-900 dark:text-gray-700 mb-4">Upload your image to remove the background automatically.</p>
            <input
                type="file"
                className="block w-full text-gray-900 mb-4 p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                onChange={handleFileChange}
            />

            {loading && (
                <div className="text-center py-4">
                    <span className="text-gray-700">Processing...</span>
                </div>
            )}

            {imageUrl && !loading && (
                <div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-600">Processed Image:</h3>
                    <img src={imageUrl} alt="Processed" className="mt-2 rounded shadow-lg w-full h-auto" />

                    {/* Dropdown for selecting size */}
                    <div className="mt-4">
                        <label className="block text-gray-700 dark:text-gray-500">Select Size:</label>
                        <select
                            value={selectedSize}
                            onChange={handleSizeChange}
                            className="w-full p-2 mt-2 border rounded-md dark:bg-gray-700 dark:text-white"
                        >
                            {sizes.map((size) => (
                                <option key={size.value} value={size.value}>
                                    {size.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add cropper */}
                    <div className="mt-4">
                        <Cropper
                            src={imageUrl}
                            style={{ height: 400, width: '100%' }}
                            aspectRatio={parseInt(selectedSize.split('x')[0]) / parseInt(selectedSize.split('x')[1])}
                            guides={false}
                            ref={(cropperInstance) => setCropper(cropperInstance)}
                        />
                    </div>

                    <div className="mt-4 flex justify-between space-x-4">
                        <button
                            onClick={handleSaveImage}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Save Image
                        </button>
                    </div>
                </div>
            )}

            {croppedImageUrl && !loading && (
                <div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Cropped Image:</h3>
                    <img src={croppedImageUrl} alt="Cropped" className="mt-2 rounded shadow-lg w-full h-auto" />
                </div>
            )}
        </div>
    );
};

export default BackgroundRemoval;
