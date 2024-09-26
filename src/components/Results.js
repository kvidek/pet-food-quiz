// src/components/Results.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../shopifyService';

const Results = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // Function to go back to the last step
    const handleBack = () => {
        navigate('/step/6');
    };

    // Function to restart the quiz
    const handleRestart = () => {
        localStorage.removeItem('quizData');
        navigate('/step/1');
    };

    useEffect(() => {
        // Load quiz data from localStorage
        const storedQuizData = localStorage.getItem('quizData');
        const quizData = storedQuizData ? JSON.parse(storedQuizData) : {};

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
                    query.push({ tag });
                });
            }

            return query;
        };

        // Fetch products from Shopify
        const productQuery = buildProductQuery(tags);
        console.log(productQuery);

        fetchProducts(productQuery).then(setProducts);
    }, []);

    return (
        <div>
            <div className="quiz-results">
                <h2>Recommended Food</h2>

                {products.length > 0 ? (
                    <ul className="product-list">
                        {products.map((product) => (
                            <li className="product" key={product.id}>
                                <div className="product-left">
                                    <img src={product.images.edges[0]?.node.src} alt={product.title} />
                                </div>
                                <div className="product-right">
                                    <h4>{product.title}</h4>
                                    <p>{product.description}</p>
                                    {product.variants?.edges.length > 0 ? (
                                        <p>
                                            Price: {product.variants.edges[0]?.node?.priceV2?.amount} {product.variants.edges[0]?.node?.priceV2?.currencyCode}
                                        </p>
                                    ) : (
                                        <p>No price available</p>
                                    )}
                                    <a href={`/products/${product.handle}`} target="_blank" rel="noopener noreferrer">
                                        View Product
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading recommended products...</p>
                )}

                <div className="buttons">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={handleRestart}>Restart Quiz</button>
                </div>
            </div>
        </div>
    );
};

export default Results;
