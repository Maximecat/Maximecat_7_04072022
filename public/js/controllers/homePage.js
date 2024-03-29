import { RecipeFactory } from "../factories/RecipeFactory.js";
import { RecipeService } from "../service/RecipeService.js";

class HomePageController {
    recipeService;

    searchInput;
    searchValue;

    btnIngredients;
    listeIngredientBlock;
    inputIngredients;

    btnAppareils;
    listeAppareilBlock;
    inputAppareils;

    btnUstensiles;
    listeUstensileBlock;
    inputUstensiles;

    iconChevron;

    tagsContainer;
    selectedTags;

    recipesContainer;
    recipes;

    constructor() {
        this.recipeService = new RecipeService();
        this.searchInput = document.getElementById('searchbar-input');
        this.searchValue = "";

        this.btnIngredients = document.getElementById('btn-ingredients');
        this.listeIngredientBlock = document.getElementById('liste-ingredient-block');
        this.inputIngredients = document.getElementById('btn-input-ingredient');
        this.iconCloseIngredients = document.getElementById('icon-close-ingredients');

        this.btnAppareils = document.getElementById('btn-appareils');
        this.listeAppareilBlock = document.getElementById('liste-appareil-block');
        this.inputAppareils = document.getElementById('btn-input-appareil');
        this.iconCloseAppareils = document.getElementById('icon-close-appareils');

        this.btnUstensiles = document.getElementById('btn-ustensiles');
        this.listeUstensileBlock = document.getElementById('liste-ustensile-block');
        this.inputUstensiles = document.getElementById('btn-input-ustensile');
        this.iconCloseUstensiles = document.getElementById('icon-close-ustensiles');

        this.tagsContainer = document.getElementById('tags-banner');
        this.selectedTags = [];

        this.recipesContainer = document.getElementById('card-container');
        this.recipes = [];

        this.getRecipesDatas();
        this.initEvents();
    }

    // Ecoute sur les inputs des boutons et de la barre de recherche
    initEvents() {
        this.btnIngredients.addEventListener('click', (e) => {
            this.btnIngredients.style.display = "none";
            this.listeIngredientBlock.style.display = "block";
            this.listeAppareilBlock.style.display = "none";
            this.listeUstensileBlock.style.display = "none";
            this.btnAppareils.style.display = "block";
            this.btnUstensiles.style.display = "block";
        });

        this.btnAppareils.addEventListener('click', (e) => {
            this.btnAppareils.style.display = "none";
            this.listeAppareilBlock.style.display = "block";
            this.listeIngredientBlock.style.display = "none";
            this.listeUstensileBlock.style.display = "none";
            this.btnIngredients.style.display = "block";
            this.btnUstensiles.style.display = "block";
        });

        this.btnUstensiles.addEventListener('click', (e) => {
            this.btnUstensiles.style.display = "none";
            this.listeUstensileBlock.style.display = "block";
            this.listeIngredientBlock.style.display = "none";
            this.listeAppareilBlock.style.display = "none";
            this.btnIngredients.style.display = "block";
            this.btnAppareils.style.display = "block";
        });

        this.iconCloseIngredients.addEventListener('click', (e) => {
            this.listeIngredientBlock.style.display = "none";
            this.btnIngredients.style.display = "block";
        });

        this.iconCloseAppareils.addEventListener('click', (e) => {
            this.listeAppareilBlock.style.display = "none";
            this.btnAppareils.style.display = "block";
        });

        this.iconCloseUstensiles.addEventListener('click', (e) => {
            this.listeUstensileBlock.style.display = "none";
            this.btnUstensiles.style.display = "block";
        });

        this.inputIngredients.addEventListener('keyup', (e) => {
            const ingredients = this.recipeService.getIngredients(this.recipes, e.target.value, this.selectedTags);
            this.displayListTag('ingredient', ingredients);
        });

        this.inputAppareils.addEventListener('keyup', (e) => {
            const appareils = this.recipeService.getAppareils(this.recipes, e.target.value, this.selectedTags);
            this.displayListTag('appareil', appareils);
        });

        this.inputUstensiles.addEventListener('keyup', (e) => {
            const ustensiles = this.recipeService.getUstensiles(this.recipes, e.target.value, this.selectedTags);
            this.displayListTag('ustensile', ustensiles);
        });

        this.searchInput.addEventListener('keyup', (e) => {
            if (e.target.value.length >= 3) {
                this.searchValue = e.target.value;
            } else {
                this.searchValue = "";
            }
            this.getRecipesDatas();
        });
    }

    // Fonction asynchrone affiche les "résultats" des recherche, les recettes correspondante et les tags assosié dans les listes déroulante
    async getRecipesDatas() {
        this.recipes = await this.recipeService.getRecipes(this.selectedTags, this.searchValue);
        this.displayRecipes();

        const ingredients = this.recipeService.getIngredients(this.recipes, null, this.selectedTags);
        this.displayListTag('ingredient', ingredients);

        const appareils = this.recipeService.getAppareils(this.recipes, null, this.selectedTags);
        this.displayListTag('appareil', appareils);

        const ustensiles = this.recipeService.getUstensiles(this.recipes, null, this.selectedTags);
        this.displayListTag('ustensile', ustensiles);
    }

    // Affiche les Recipe Cards dans le main
    displayRecipes() {
        this.recipesContainer.innerHTML = "";

        for (const recipe of this.recipes) {
            const recipeFactory = new RecipeFactory(recipe);
            const recipeCard = recipeFactory.createRecipeCard();

            this.recipesContainer.appendChild(recipeCard);
        }
    }

    // Affiche les éléments de chaques catégories dans le menu déroulant du bouton associé + écoute sur les listes, ajout des éléments au tableau des tags sélectionnés au clique dans les listes
    displayListTag(typeTag, arrayTag) {
        const tagPart = document.getElementById(`liste-${typeTag}-part`);
        tagPart.innerHTML = "";

        const tagList = document.createElement('ul');
        tagList.className = "btn-liste";

        tagPart.appendChild(tagList);

        for (let i = 0; i < arrayTag.length; i++) {
            const listeElement = document.createElement('li');
            listeElement.className = "btn-liste-element";
            listeElement.innerText = arrayTag[i];

            listeElement.addEventListener('click', (e) => {
                this.selectedTags.push({
                    type: typeTag,
                    value: e.target.innerText
                });
                this.displayTags();
                this.getRecipesDatas();
            })

            tagList.appendChild(listeElement);
        }
    }

    // Affichage de chaque tag contenu dans le tableau des tags sélectionnés avec la couleur propre à sa catégorie dans le tag container
    displayTags() {

        this.tagsContainer.innerHTML = "";

        for (let i = 0, len = this.selectedTags.length; i < len; i++) {
            const tagSpan = document.createElement('span');
            tagSpan.className = `tag bg-${this.selectedTags[i].type}`;
            tagSpan.innerText = this.selectedTags[i].value;

            const icon = document.createElement('i');
            icon.className = "fa-regular fa-circle-xmark";
            icon.addEventListener('click', () => {
                this.selectedTags.splice(i, 1);
                this.displayTags();
                this.getRecipesDatas();
            });

            tagSpan.appendChild(icon);
            this.tagsContainer.appendChild(tagSpan);
        }
    }
}

new HomePageController();