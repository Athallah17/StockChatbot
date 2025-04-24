# test.py

from crewai import Agent, Task, Crew

agent = Agent(
    role="Stock Advisor",
    goal="Give stock buying advice",
    backstory="Financial expert with knowledge of market trends.",
    verbose=True,
    memory=False  # Still disable memory
)

task = Task(
    description="Should I buy AAPL stock today?",
    agent=agent,
    expected_output="A clear recommendation whether to buy, hold, or sell Tesla stock, based on market data and trends."
    )

crew = Crew(
    agents=[agent],
    tasks=[task],
    verbose=True
)

result = crew.kickoff()
print(result)
