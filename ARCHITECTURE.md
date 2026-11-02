# Architecture

Architecture at `481372c379cfefae3cad50cff004dbb5658f421d` (`main`).

```mermaid
flowchart LR
    Visitor[Visitor] -->|opens page| Browser[Web browser]
    Fonts["Google Fonts: fonts.googleapis.com"]

    subgraph Page["Client-side page"]
        HTML["index.html"]
        CSS["style.css"]
        Hero["images/Pancake_Top.png"]
        Left["images/Pancake_Bottom_Left.png"]
        Right["images/Pancake_Bottom_Right.png"]

        HTML --> DOM["Recipe page structure"]
        DOM --> HeroSection["Hero image"]
        DOM --> Recipe["Recipe content"]
        Recipe --> Intro["Title and introduction"]
        Recipe --> Lists["Ingredients and instructions"]
        Recipe --> Gallery["Serving suggestions"]
        Gallery --> Left
        Gallery --> Right

        HTML -->|links stylesheet| CSS
        HTML -->|references hero| Hero
        HTML -->|references gallery| Left
        HTML -->|references gallery| Right
        CSS -->|styles layout and content| DOM
        CSS -->|imports Open Sans| Fonts
    end

    Browser -->|loads page and local assets| HTML
    Fonts -->|font resources| Browser
```

The page is a static HTML/CSS frontend. The browser loads the local page,
stylesheet, and images; the stylesheet imports Open Sans from Google Fonts.
There is no application backend or build step represented at this tip.
