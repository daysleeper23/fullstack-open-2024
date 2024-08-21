sequenceDiagram
participant browser
participant server

Note right of browser: The browser executes the function that adds the new note locally and rerenders the notes

browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
activate server
server-->>browser: {"message":"note created"}
deactivate server

