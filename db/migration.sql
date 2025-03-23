-- Migration pour augmenter la taille du champ image
ALTER TABLE produits ALTER COLUMN image TYPE TEXT; 