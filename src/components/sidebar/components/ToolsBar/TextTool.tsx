
const TextTool = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <h2 className="text-xl font-bold mb-1">Text Tool</h2>
      <div className="text-center text-sm text-gray-500 flex flex-col gap-2">
        <p>Click on the canvas to add a text box. You can move the box by simple dragging it.</p>
        <p>To edit, double click on the text box and start typing.</p>
        <p>You can also resize the box by dragging the grabber on the right side.</p>
      </div>
    </div>
  )
}

export default TextTool
