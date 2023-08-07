import openai
openai.api_key = "sk-..."


def create_comment(text):
    model = "gpt3"
    pp = "generate a 3 comment around 20-30 words for the given \n\text: \n" + text

    chat_completion = gen.Completion.create(
        engine=model,
        prompt=pp,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.5
    )

    answer = chat_completion.choices[0].text.strip()
    return answer
