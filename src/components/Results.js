// src/components/Results.js
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchProducts} from '../shopifyService';

const Results = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [catName, setCatName] = useState('');
    const [quantities, setQuantities] = useState({});

    // Function to go back to the last step
    const handleBack = () => {
        navigate('/step/6');
    };

    // Function to restart the quiz
    const handleRestart = () => {
        localStorage.removeItem('quizData');
        navigate('/step/1');
    };

    // Function to handle quantity change
    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: newQuantity
        }));
    };

    // Collect variant IDs and quantities
    const collectVariantIds = () => {
        return products.map(product => ({
            variantId: product.variants.edges[0]?.node.id.split('/').pop(),
            quantity: quantities[product.id]
        }));
    };

    // Function to create the checkout URL
    const createCheckoutUrl = (variants) => {
        const baseUrl = 'https://67f1af-72.myshopify.com/cart';
        const variantsString = variants.map(({variantId, quantity}) => `${variantId}:${quantity}`).join(',');
        return `${baseUrl}/${variantsString}`;
    };

    // Handle adding to cart
    const handleAddToCart = () => {
        const variants = collectVariantIds();
        const checkoutUrl = createCheckoutUrl(variants);
        window.open(checkoutUrl, '_blank'); // Open cart in new tab
    };

    useEffect(() => {
        // Load quiz data from localStorage
        const storedQuizData = localStorage.getItem('quizData');
        const quizData = storedQuizData ? JSON.parse(storedQuizData) : {};

        // Set catName from quizData
        setCatName(quizData.name || 'your cat');

        // Function to generate tags based on quizData
        const generateTags = (quizData) => {
            const tags = [];

            if (quizData.age <= 1) {
                tags.push('kitten');
            } else {
                tags.push('older cat');
            }

            // Add more conditions as needed
            return tags;
        };

        // Generate tags from quizData
        const tags = generateTags(quizData);

        // Build a query based on the tags
        const buildProductQuery = (tags) => {
            const query = [];

            if (tags && tags.length > 0) {
                tags.forEach(tag => {
                    query.push({tag});
                });
            }

            return query;
        };

        // Fetch products from Shopify
        const productQuery = buildProductQuery(tags);

        console.log(productQuery);
        console.log(storedQuizData);

        fetchProducts(productQuery).then(fetchedProducts => {
            setProducts(fetchedProducts);

            // Set initial quantities for each product (default to 1)
            const initialQuantities = fetchedProducts.reduce((acc, product) => ({
                ...acc,
                [product.id]: quizData.weight <= 2 ? 1 : 3
            }), {});
            setQuantities(initialQuantities);
        });
    }, []);

    return (
        <div>
            <div className="quiz-results">
                <h2>Recommended Food for {catName}</h2>

                {products.length > 0 ? (
                    <ul className="product-list">
                        {products.map((product) => {

                            const productPrice = product.variants.edges[0]?.node?.priceV2?.amount;
                            const totalPerProduct = productPrice * quantities[product.id];

                            return (
                                <li className="product" key={product.id}>
                                    <div className="product-left">
                                        <img src={product.images.edges[0]?.node.src} alt={product.title}/>
                                    </div>
                                    <div className="product-right">
                                        <h4>{product.title}</h4>
                                        <p>{product.description}</p>
                                        {product.variants?.edges.length > 0 ? (
                                            <p>
                                                Price: {productPrice} {product.variants.edges[0]?.node?.priceV2?.currencyCode}
                                            </p>
                                        ) : (
                                            <p>No price available</p>
                                        )}
                                        <a href={`/products/${product.handle}`} target="_blank"
                                           rel="noopener noreferrer">
                                            View Product
                                        </a>
                                    </div>
                                    <label>
                                        Quantity:
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[product.id]}
                                            onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                                        />
                                    </label>
                                    <p>Total: {totalPerProduct.toFixed(2)} {product.variants.edges[0]?.node.priceV2.currencyCode}</p>

                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Loading recommended products...</p>
                )}

                <div className="buttons">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={handleRestart}>Restart Quiz</button>

                    {/* Add all to cart button */}
                    {products.length > 0 && (
                        <button onClick={handleAddToCart}>
                            Add All to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
