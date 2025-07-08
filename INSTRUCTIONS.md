# How to Update Your Baby's Development Journey Website

This website displays journal entries and milestones from the `data/journal_entries.json` file and images from the `data/images/` directory.

## 1. Adding New Journal Entries

To add a new monthly journal entry, you need to edit the `data/journal_entries.json` file. This file contains a list (an array) of journal entries. Each entry is an object with specific fields.

**Structure of a Journal Entry:**

```json
{
    "month": "MonthName YYYY",     // e.g., "April 2024" - Human-readable month and year
    "monthId": "YYYY-MM",          // e.g., "2024-04" - Used for sorting and linking, MUST be unique
    "title": "Your Catchy Title for the Month",
    "content": "Write your journal entry here. You can use basic HTML for paragraphs like <p>This is a paragraph.</p> <p>And another one.</p> Be careful with quotes inside the content; they need to be escaped if you're writing HTML directly (e.g., use &quot; for \"). It's often easier to keep content simple text, or ensure your JSON is valid.",
    "pictures": [
        "images/your_image_name1.jpg", // Path relative to the 'data' directory
        "images/your_image_name2.png"
    ],
    "milestones": [
        "Milestone 1 for this month",
        "Milestone 2 achieved",
        "Another cool thing baby did"
    ]
}
```

**Steps to Add a New Entry:**

1.  **Open `data/journal_entries.json`** in a text editor.
2.  **Locate the main array (starts with `[` and ends with `]`).**
3.  **Add a new entry object.** If there are existing entries, add a comma `,` after the previous entry's closing curly brace `}` before adding your new entry.
    *   **Important:** The website sorts entries by `monthId` with the newest first. Ensure your `monthId` (e.g., "2024-05" for May 2024) is correct.
4.  **Fill in the fields:**
    *   `month`: User-friendly display (e.g., "May 2024").
    *   `monthId`: Unique identifier in "YYYY-MM" format (e.g., "2024-05").
    *   `title`: A title for the month's entry.
    *   `content`: Your journal text. For multiple paragraphs, you can use `<p>Paragraph 1</p><p>Paragraph 2</p>`.
    *   `pictures`: An array of strings, where each string is the path to an image. See section 2 below for adding pictures. If no pictures for this month, use an empty array: `[]`.
    *   `milestones`: An array of strings, listing development milestones for the month. If no specific milestones, use an empty array: `[]`.
5.  **Validate your JSON.** After editing, it's crucial to ensure the JSON is still valid. You can use an online JSON validator to check for syntax errors (like missing commas, incorrect quotes, etc.). An invalid JSON file will prevent the website from loading entries.

**Example: Adding a new entry after an existing one:**

```json
[
    // ... previous entries ...
    {
        "month": "March 2024",
        "monthId": "2024-03",
        "title": "Discovering the World",
        "content": "Rolling over is the new favorite activity!",
        "pictures": ["images/placeholder_mar_1.jpg"],
        "milestones": ["Rolling over"]
    }, // <--- Add comma here if this wasn't the last entry
    { // <--- New entry starts here
        "month": "April 2024",
        "monthId": "2024-04",
        "title": "Eating Solids!",
        "content": "<p>Baby started trying solid foods this month. Bananas are a hit!</p>",
        "pictures": ["images/april_food.jpg", "images/april_playtime.jpg"],
        "milestones": ["Started eating solid foods", "Sitting up with support"]
    }
]
```

## 2. Adding Pictures

1.  **Prepare your images:**
    *   Ideally, resize them to be web-friendly (e.g., not excessively large in file size). Around 600-800px wide is often sufficient for the display here.
    *   Use common web formats like `.jpg`, `.jpeg`, or `.png`.
2.  **Place your image files into the `data/images/` directory.**
    *   For example, if you have `baby_first_steps.jpg`, put it in `data/images/baby_first_steps.jpg`.
3.  **Reference the images in `journal_entries.json`:**
    *   In the `pictures` array for the relevant month's entry, add the path `images/your_image_name.jpg`.
    *   **Important:** The path in the JSON file must start with `images/` because it's relative to the `data` directory where `journal_entries.json` is located, but the JavaScript constructs the final path as `data/images/your_image_name.jpg`.

## 3. Viewing Your Changes

After updating `data/journal_entries.json` and adding any new images to `data/images/`, simply open the `index.html` file in your web browser. If you already have it open, refresh the page.

**Troubleshooting:**

*   **Entries not showing up?** Most likely an error in `data/journal_entries.json`. Use a JSON validator to check its syntax. Also, check your browser's developer console (usually F12) for error messages.
*   **Images not showing up?**
    *   Double-check the path in the `pictures` array in your JSON file. It should be like `"images/my_picture.jpg"`.
    *   Ensure the image file is actually in the `data/images/` directory and the filename matches exactly (case-sensitive on some systems).
    *   Check the browser's developer console for "404 Not Found" errors for images.

By following these steps, you can keep your baby's development journal website up-to-date with new memories and milestones!
```
