# LinkedIn AI Post Filter and Comment Suggester Chrome Extension

This is a simple Chrome extension that enhances your LinkedIn feed by filtering posts related to Artificial Intelligence (AI) and providing three comment suggestions for each AI-related post using the OpenAI ChatGPT API.

## Features

- Filters LinkedIn feed to display only posts related to AI.
- Provides three comment suggestions using the ChatGPT API for each AI-related post.

## Requirements

- Python 3.6+
- Google Chrome
- Flask
- OpenAI API key (optional)

## Installation

1. Clone or download this repository to your local machine.
2. Download the model using the provided ipynb notebook and save it on server/mo dict or use this <a src="https://colab.research.google.com/drive/1TKaX5MH4ef821m4-Jn43imnY9WJMilFV?usp=sharing">Colab</a> to download.
3. Uncomment some code in server/main.py to use openai api for comment generation.
4. Run the server using `flask --app server/main.py run`
5. Open Google Chrome and go to `chrome://extensions/` (or select "Extensions" from the menu under "More Tools").
6. Enable "Developer mode" by toggling the switch in the top right corner.
7. Click the "Load unpacked" button and select the directory where you cloned/downloaded this repository.

## Usage

1. Log in to your LinkedIn account in Google Chrome.
2. Open your LinkedIn feed by going to `https://www.linkedin.com/feed/`.
3. The extension will automatically filter AI-related posts and it can viewed in little pop of extension and suggest three comments for each post.
4. Click on a suggested comment to add that.

## Configuration

You can configure the extension by modifying the following files:

- `manifest.json`: Modify permissions, icons, and other extension details.
- `server/main.py`: Adjust the filtering logic and comment suggestion code.

## ChatGPT API

The comment suggestions are generated using the OpenAI ChatGPT API. To use the API, you need to provide your API key in the `server/gen.py` file.
