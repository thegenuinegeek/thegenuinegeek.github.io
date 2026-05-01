import figlet from 'figlet';

/**
 * Generates ASCII art for a title using figlet.
 * Uses the 'Small' font to handle longer titles better.
 */
export function generateAsciiArt(text: string): string {
  try {
    return figlet.textSync(text, {
      font: 'Small',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    });
  } catch (err) {
    console.error('Error generating ASCII art:', err);
    return text;
  }
}
