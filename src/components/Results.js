import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../shopifyService';

const Results = () => {
    const navigate = useNavigate();
    const [productsByPet, setProductsByPet] = useState([]);
    const [catNames, setCatNames] = useState([]);
    const [quantitiesByPet, setQuantitiesByPet] = useState([]);

    const handleBack = () => {
        navigate('/step/6');
    };

    const handleRestart = () => {
        localStorage.removeItem('quizData');
        navigate('/step/1');
    };

    const handleQuantityChange = (petIndex, productId, newQuantity) => {
        if (newQuantity < 1) {
            newQuantity = 1;
        }
        setQuantitiesByPet(prevQuantities => {
            const updatedQuantities = [...prevQuantities];
            updatedQuantities[petIndex] = {
                ...updatedQuantities[petIndex],
                [productId]: newQuantity
            };
            return updatedQuantities;
        });
    };

    const createCheckoutUrl = (variants) => {
        const baseUrl = 'https://kvidek-test-store.myshopify.com/cart';
        const variantsString = variants.map(({ variantId, quantity }) => `${variantId}:${quantity}`).join(',');
        return `${baseUrl}/${variantsString}`;
    };

    const handleAddToCart = () => {
        const allVariants = productsByPet.flatMap((products, petIndex) =>
            products.map(product => ({
                variantId: product.variants?.edges[0]?.node.id.split('/').pop(),
                quantity: quantitiesByPet[petIndex][product.id]
            }))
        );
        const checkoutUrl = createCheckoutUrl(allVariants);
        window.open(checkoutUrl, '_blank');
    };

    useEffect(() => {
        const storedQuizData = localStorage.getItem('quizData');
        const quizData = storedQuizData ? JSON.parse(storedQuizData) : [];

        const catNames = quizData.map(pet => pet.name || 'your cat');
        setCatNames(catNames);

        const generateTags = (pet) => {
            const tags = [];
            if (pet.age <= 1) {
                tags.push('kitten');
            } else {
                tags.push('older cat');
            }
            return tags;
        };

        const fetchProductsForPets = async () => {
            const productsByPet = [];
            const quantitiesByPet = [];

            for (const pet of quizData) {
                const tags = generateTags(pet);
                const productQuery = tags.map(tag => ({ tag }));
                const fetchedProducts = await fetchProducts(productQuery);
                productsByPet.push(fetchedProducts);

                const initialQuantities = fetchedProducts.reduce((acc, product) => ({
                    ...acc,
                    [product.id]: pet.weight <= 2 ? 1 : 3
                }), {});
                quantitiesByPet.push(initialQuantities);
            }

            setProductsByPet(productsByPet);
            setQuantitiesByPet(quantitiesByPet);
        };

        fetchProductsForPets();
    }, []);

    return (
        <div>
            <div className="quiz-results">
                {catNames.map((catName, petIndex) => (
                    <div className="quiz-results-group" key={petIndex}>
                        <h2>Recommended Food for {catName}</h2>
                        {productsByPet[petIndex]?.length > 0 ? (
                            <ul className="product-list">
                                {productsByPet[petIndex].map((product) => {
                                    const productPrice = product.variants?.edges[0]?.node?.priceV2?.amount;
                                    const totalPerProduct = productPrice * quantitiesByPet[petIndex][product.id];

                                    return (
                                        <li className="product" key={product.id}>
                                            <div className="product-left">
                                                <img src={product.images.edges[0]?.node.src} alt={product.title}/>
                                            </div>
                                            <div className="product-center">
                                                <h2>{product.title}</h2>
                                                <p>{product.description}</p>
                                                {product.variants?.edges.length > 0 ? (
                                                    <p>
                                                        Price: <b>{productPrice} {product.variants.edges[0]?.node?.priceV2?.currencyCode}</b>
                                                    </p>
                                                ) : (
                                                    <p>No price available</p>
                                                )}
                                            </div>
                                            <div className="product-right">
                                                <label className="quantity">
                                                    <span>Qty:</span>
                                                    <div className="quantity-input">
                                                        <button className="button button-small"
                                                                onClick={() => handleQuantityChange(petIndex, product.id, quantitiesByPet[petIndex][product.id] - 1)}>-
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={quantitiesByPet[petIndex][product.id]}
                                                            onChange={(e) => handleQuantityChange(petIndex, product.id, Number(e.target.value))}
                                                        />
                                                        <button className="button button-small"
                                                                onClick={() => handleQuantityChange(petIndex, product.id, quantitiesByPet[petIndex][product.id] + 1)}>+
                                                        </button>
                                                    </div>
                                                </label>
                                                <p>Total: <b>{totalPerProduct?.toFixed(2)} {product.variants?.edges[0]?.node.priceV2.currencyCode}</b>
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>Loading recommended products...</p>
                        )}
                    </div>
                ))}
                <div className="cart-total">
                    <p>Order total: <b>
                        {productsByPet.reduce((total, products, petIndex) => {
                            return total + products.reduce((acc, product) => {
                                return acc + (product.variants?.edges[0]?.node.priceV2.amount * quantitiesByPet[petIndex][product.id] || 0);
                            }, 0);
                        }, 0).toFixed(2)}
                        {productsByPet[0]?.[0]?.variants?.edges[0]?.node.priceV2.currencyCode}
                    </b></p>
                </div>
                <div className="buttons">
                    <button className="button button-bordered" onClick={handleBack}>Back</button>
                    <button className="button button-bordered" onClick={handleRestart}>Restart Quiz</button>
                    {productsByPet.length > 0 && (
                        <button onClick={() => handleAddToCart(0)}>
                            Complete order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
