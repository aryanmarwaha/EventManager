# Fork and Clone Python Project Setup with `venv`

This guide will walk you through forking and cloning this particular project and setting it up in your local environment using `venv`. Make sure you have Python 3 installed before proceeding.

## Prerequisites

- Python 3: You can download and install Python 3 from the [official Python website](https://www.python.org/downloads/).

## Fork and Clone the Repository

1. **Fork the Repository:**
   - Navigate to the repository on GitHub.
   - Click on the "Fork" button in the top-right corner to create a copy under your GitHub account.

2. **Clone the Forked Repository:**
   - Open your terminal/cmd

     #### For macOS/Linux/windows:
     ```bash
     git clone https://github.com/aryanmarwaha/EventManager.git
     ```

## Set Up Environment (macOS/Linux)
  - Navigate to the Cloned Repository:
    
    ```bash
     cd EventManager
    ```
  - Create a virtual environment:
    
    ```bash
     python -m venv venv
    ```
  - Activate the Virtual Environment:

    ```bash
     ./venv/bin/activate
    ```
  - Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```


## Set Up Environment (windows)
  - Navigate to the Cloned Repository:
    
    ```bash
     cd EventManager
    ```
  - Create a virtual environment:
    
    ```bash
     python -m venv venv
    ```
  - Activate the Virtual Environment:

    ```bash
     .\venv\Scripts\activate.bat
    ```
  - Install dependencies:
    
    ```bash
    pip install -r requirements.txt
    ```
    
## Running the Project
  - Once the environment is setup, you can run the project using the command:
    
    ```bash
    python app.py
    ```
## Deactivate environment
  - Remember to deactivate the virtual environment when you're done working on the project or you may simply close the terminal.
  - To deactivate the environment, exit the process using `ctrl+c` and type:
    
    ```bash
    deactivate
    ```
