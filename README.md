# LSL Data API

This project encompasses a [Python](https://www.python.org) server that can be used as a **Provider** API for DynDash applications. The server is capable of interacting with [LSL](https://labstreaminglayer.org/#/) data, and converting it into a DynDash compatible **Type**.

The application may also be referred to as **LSL Integration API**, or short **LiA**.

---

## Features

### Included **Provider** Roles:
- [x] **Component Provider** for
	- Control panel **Components** for the server's features
	- Visualizer **Component** for 3D point markers
- [x] **Source Provider** for
	- Any **Sources** created from converted [LSL](https://labstreaminglayer.org/#/) streams
- [x] **Type Provider** for
	- A specialized motion capture **Type**

### [LSL](https://labstreaminglayer.org/#/)-Related Features:
- [x] Scanning the network for [LSL](https://labstreaminglayer.org/#/) streams
- [x] Interfacing with a local [LabRecorder](https://github.com/labstreaminglayer/App-LabRecorder) application
- [x] Loading and serving [LabRecorder](https://github.com/labstreaminglayer/App-LabRecorder) recordings

---

## Screenshots

|control panel for interacting with the server|control panel for making the server interact with a [LabRecorder](https://github.com/labstreaminglayer/App-LabRecorder)|
|-|-|
|![DynDash_Component_LiA](/media/screenshots/DynDash_Component_LiA.png)|![DynDash_Component_LR](/media/screenshots/DynDash_Component_LR.png)|

---

## Installation

This project uses [Python](https://www.python.org) 3.12.2.
You can create a local virtual environment that meets this requirement using [pyenv](https://github.com/pyenv/pyenv):
```
pyenv virtualenv 3.12.2 lia
```

Then, you can run the installation of the required dependencies:
```
pip install -r requirements.txt
```

You may need to install [liblsl](https://github.com/sccn/liblsl) separately for the application to run properly.
On macOS, you can do so using [Homebrew](https://brew.sh):
```
brew install labstreaminglayer/tap/lsl
```

---

## Running the Application

Starting the application can be done with the following command:

```
PYTHONPATH=src uvicorn src.main:app --reload --reload-exclude "src/dumps/*" --port 3151
```

Starting a Dummy Broadcast can be done by running the following command:

```
python src/dummy_broadcast.py
```

---

## Development Status

This is an early version of the application, so some features are not implemented quite as well or optimized as they could be.

However, the application is in active development, with the goal of improving it in the areas where its implementation is lacking. An expansion of its features is also planned, though the details on the scope of that are currently unclear.

This also means that some things are subject to change in future versions.

> [!NOTE]
> The documentation of the application is currently quite rudimentary. This fact is known and one of the first areas that are likely to change a lot.

---

## License
The project is licensed under the [GNU AGPL v3 License](https://www.gnu.org/licenses/agpl-3.0.de.html)

---