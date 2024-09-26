import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchProducts} from '../shopifyService';

const Results = ({quizData}) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // Function to go back to the last step
    const handleBack = () => {
        // Assuming the last step was step 6 (you can adjust this based on your quiz)
        navigate('/step/6');
    };

    // Function to restart the quiz
    const handleRestart = () => {
        // Clear quiz data from localStorage
        localStorage.removeItem('quizData');

        // Redirect to the first step of the quiz
        navigate('/step/1');
    };

    useEffect(() => {
        // Build a query based on the quiz data
        const buildProductQuery = () => {
            let query = "cat food";
            //
            // if (quizData.age < 1) {
            //     query += " kitten";
            // } else if (quizData.age > 10) {
            //     query += " senior";
            // }
            //
            // if (quizData.breed === "Maine Coon") {
            //     query += " large breed";
            // }
            //
            // if (quizData.allergies.includes("grain")) {
            //     query += " grain-free";
            // }

            return query;
        };

        // Fetch products from Shopify
        const productQuery = buildProductQuery();

        fetchProducts(productQuery).then(setProducts);
    }, [quizData]);

    return (
        <div>
            {quizData ? (
                <div className="quiz-results">
                    <h2>Recommended Food for {quizData.name}</h2>

                    {products.length > 0 ? (
                        <ul className="produc-list">
                            {products.map((product) => {
                                console.log('product: ', product);

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
                                                    Price: {product.variants.edges[0]?.node?.priceV2?.amount} {product.variants.edges[0]?.node?.priceV2?.currencyCode}
                                                </p>
                                            ) : (
                                                <p>No price available</p>
                                            )}
                                            <a href={`/products/${product.handle}`} target="_blank"
                                               rel="noopener noreferrer">
                                                View Product
                                            </a>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>

                    ) : (
                        <p>Loading recommended products...</p>
                    )}

                    <div className="buttons">
                        <button onClick={handleBack}>
                            Back
                        </button>
                        <button onClick={handleRestart}>
                            Restart Quiz
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading results...</p>
            )}
        </div>
    );
};

export default Results;
