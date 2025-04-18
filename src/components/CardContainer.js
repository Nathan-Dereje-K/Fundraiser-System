import React, { useEffect, useState } from 'react';
import Card from './card';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import coinsGrass from '../assests/image2.jpg';

function CardContainer() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/cards')
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error('Error fetching cards:', error));
  }, []);

  return (
    <div className={'flex-row justify-content: flex-start m-12 space-y-8'} >
    {cards.map((card, index) => (
        <CardWithAnimation
          key={index}
          title={card.title}
          image={coinsGrass}
          description={card.description}
          link={card.link}
        />
      ))}
    </div>


  );
}

function CardWithAnimation({ title, image, description, link }) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,  
    threshold: 0.2,     
  });

  useEffect(() => {
    if (inView) {
      controls.start({ x: 0, opacity: 1 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ x: -100, opacity: 0 }}
      animate={controls}
      transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
      className="w-full max-w-md"
    >
      <Card title={title} image={image} description={description} link={link} />
    </motion.div>
  );
}

export default CardContainer;
