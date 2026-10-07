# 🗂️ Estructura sugerida del repositorio — S.O.S Solar

## Mapa de carpetas

```text
S.O.S-Solar/
├── README.md                     # Página principal (divulgación)
├── TECHNICAL_DOCS.md             # Anexo técnico (especialistas)
├── REPO_STRUCTURE.md             # Este mapa
├── LICENSE                       # Licencia (MIT sugerida)
├── CONTRIBUTING.md               # (opcional) Guía para colaborar
├── .gitignore
│
├── docs/
│   ├── general/                  # Material divulgativo
│   │   ├── glosario.md
│   │   └── guia-de-uso.md        # Cómo usar la estación
│   ├── technical/
│   │   ├── autonomia-bogota.md
│   │   ├── gestion-bateria.md
│   │   └── protocolo-pruebas.md
│   ├── presentations/            # Presentaciones para directivos y docentes
│   └── references/               # Datasheets y fuentes
│       ├── EGS002_datasheet.pdf
│       ├── mosfet_datasheet.pdf
│       └── bateria_agm_datasheet.pdf
│
├── schematics/
│   ├── system/                   # Esquema general (panel, controlador, batería)
│   └── inverter/                 # Esquemático del inversor SPWM
│       ├── inverter.sch          # Fuente editable (EDA)
│       └── inverter.pdf          # Exportación para lectura
│
├── pcb/
│   └── inverter/
│       ├── inverter.kicad_pcb    # Fuente editable (según tu software)
│       ├── gerbers/              # Archivos de fabricación
│       └── bom.csv               # Lista de materiales
│
├── measurements/                 # Datos de validación
│   ├── input_voltage/            # Panel -> Controlador
│   ├── charge_curves/            # Curvas de carga/descarga
│   ├── oscilloscope/             # Capturas y CSV de onda de salida
│   └── efficiency/               # Eficiencia y rizado
│
├── media/
│   ├── images/
│   │   ├── prototype/            # Fotos del prototipo
│   │   ├── schematics/           # Imágenes de esquemáticos y PCB
│   │   └── diagrams/             # Diagramas de bloques
│   ├── videos/                   # Demostraciones
│   └── banner.png                # Banner del README
│
├── hardware/
│   ├── enclosure/                # Diseño de la carcasa / estación
│   └── bom/                      # Lista de materiales general
│
└── .github/
    ├── ISSUE_TEMPLATE/
    └── workflows/                # (opcional) Validaciones automáticas
```

## Convenciones recomendadas

| Tema | Recomendación |
|---|---|
| Nombres de archivos | minúsculas, sin espacios, con guiones (`curva-carga-agm.csv`) |
| Imágenes | PNG/JPG optimizados (< 1 MB cuando sea posible) |
| Videos | Subirlos a YouTube o Drive y enlazarlos si pesan mucho |
| Fuentes editables | Guardar siempre el archivo editable y una exportación PDF/PNG |
| Mediciones | CSV con encabezados y unidades; fecha y condiciones en el nombre |
| Versiones | Usar etiquetas (`v0.1-prototipo`, `v1.0`) en GitHub Releases |

## Primeros pasos para crearla

```bash
mkdir -p docs/{general,technical,presentations,references} \
         schematics/{system,inverter} pcb/inverter/gerbers \
         measurements/{input_voltage,charge_curves,oscilloscope,efficiency} \
         media/{images/{prototype,schematics,diagrams},videos} \
         hardware/{enclosure,bom} .github/ISSUE_TEMPLATE
```

> 💡 Git no sube carpetas vacías. Agrega un archivo `.gitkeep` dentro de cada carpeta que quieras conservar vacía.
