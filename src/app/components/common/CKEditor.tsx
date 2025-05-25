'use client'

import React, { FC } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  Link,
  List,
  Font,
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  SourceEditing,
  Alignment,
  CodeBlock,
  FindAndReplace,
  FontSize,
  HorizontalLine,
  MediaEmbed,
  PageBreak,
  RemoveFormat,
  SpecialCharacters,
  Strikethrough,
  Subscript,
  Superscript,
  WordCount,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

interface CkEditorProps {
  editorData: string
  setEditorData: React.Dispatch<React.SetStateAction<string>>
  handleOnUpdate: (editor: string, field: string) => void
  onImageUpload?: (file: File) => Promise<string>
}

interface FileLoader {
  file: Promise<File>
}

interface UploadAdapter {
  upload(): Promise<{ default: string }>
  abort?(): void
}

interface Editor {
  plugins: {
    get(name: string): {
      createUploadAdapter(loader: FileLoader): UploadAdapter
    }
  }
}

// Custom Upload Adapter
class CustomUploadAdapter implements UploadAdapter {
  private loader: FileLoader
  private uploadCallback: (file: File) => Promise<string>

  constructor(
    loader: FileLoader,
    uploadCallback: (file: File) => Promise<string>
  ) {
    this.loader = loader
    this.uploadCallback = uploadCallback
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then((file: File) =>
      this.uploadCallback(file).then((url) => ({
        default: url,
      }))
    )
  }

  abort(): void {
    // Implement abort if needed
  }
}

const CkEditor: FC<CkEditorProps> = ({
  setEditorData,
  editorData,
  handleOnUpdate,
  onImageUpload,
}) => {
  // Plugin function to create custom upload adapter
  function CustomUploadAdapterPlugin(editor: Editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: FileLoader
    ) => {
      if (!onImageUpload) {
        console.warn('Image upload callback not provided')
        // Return a dummy adapter that does nothing
        return {
          upload: () => Promise.reject('Upload callback not configured'),
          abort: () => {},
        }
      }
      return new CustomUploadAdapter(loader, onImageUpload)
    }
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      config={{
        licenseKey: 'GPL',
        extraPlugins: [CustomUploadAdapterPlugin],
        plugins: [
          Alignment,
          Autoformat,
          BlockQuote,
          Bold,
          CloudServices,
          CodeBlock,
          Essentials,
          FindAndReplace,
          Font,
          FontSize,
          Heading,
          HorizontalLine,
          Image,
          ImageCaption,
          ImageResize,
          ImageStyle,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          MediaEmbed,
          Mention,
          PageBreak,
          Paragraph,
          PasteFromOffice,
          PictureEditing,
          RemoveFormat,
          SpecialCharacters,
          Strikethrough,
          Subscript,
          Superscript,
          Table,
          TableColumnResize,
          TableToolbar,
          TextTransformation,
          Underline,
          SourceEditing,
          WordCount,
        ],
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            '|',
            'alignment',
            '|',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'link',
            'uploadImage',
            'mediaEmbed',
            'insertTable',
            'horizontalLine',
            'pageBreak',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'codeBlock',
            'specialCharacters',
            '|',
            'removeFormat',
            'findAndReplace',
            'sourceEditing',
          ],
          shouldNotGroupWhenFull: true,
        },

        heading: {
          options: [
            {
              model: 'paragraph',
              title: 'Paragraph',
              class: 'ck-heading_paragraph',
            },
            {
              model: 'heading1',
              view: 'h1',
              title: 'Heading 1',
              class: 'ck-heading_heading1',
            },
            {
              model: 'heading2',
              view: 'h2',
              title: 'Heading 2',
              class: 'ck-heading_heading2',
            },
            {
              model: 'heading3',
              view: 'h3',
              title: 'Heading 3',
              class: 'ck-heading_heading3',
            },
            {
              model: 'heading4',
              view: 'h4',
              title: 'Heading 4',
              class: 'ck-heading_heading4',
            },
            {
              model: 'heading5',
              view: 'h5',
              title: 'Heading 5',
              class: 'ck-heading_heading5',
            },
            {
              model: 'heading6',
              view: 'h6',
              title: 'Heading 6',
              class: 'ck-heading_heading6',
            },
          ],
        },
        fontSize: {
          options: [
            'tiny',
            'small',
            'default',
            'big',
            'huge',
            8,
            10,
            12,
            14,
            16,
            18,
            20,
            22,
            24,
            26,
            28,
            30,
          ],
        },
        image: {
          resizeOptions: [
            {
              name: 'resizeImage:original',
              label: 'Default image width',
              value: null,
            },
            {
              name: 'resizeImage:25',
              label: '25% page width',
              value: '25',
            },
            {
              name: 'resizeImage:50',
              label: '50% page width',
              value: '50',
            },
            {
              name: 'resizeImage:75',
              label: '75% page width',
              value: '75',
            },
            {
              name: 'resizeImage:100',
              label: '100% page width',
              value: '100',
            },
          ],
          toolbar: [
            'imageTextAlternative',
            'toggleImageCaption',
            '|',
            'imageStyle:inline',
            'imageStyle:wrapText',
            'imageStyle:breakText',
            'imageStyle:side',
            '|',
            'resizeImage',
          ],
          upload: {
            types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
          },
        },
        fontColor: {
          colors: [
            {
              color: 'hsl(0, 0%, 0%)',
              label: 'Black',
            },
            {
              color: 'hsl(0, 0%, 30%)',
              label: 'Dim grey',
            },
            {
              color: 'hsl(0, 0%, 60%)',
              label: 'Grey',
            },
            {
              color: 'hsl(0, 0%, 90%)',
              label: 'Light grey',
            },
            {
              color: 'hsl(0, 0%, 100%)',
              label: 'White',
              hasBorder: true,
            },
            {
              color: 'hsl(0, 75%, 60%)',
              label: 'Red',
            },
            {
              color: 'hsl(30, 75%, 60%)',
              label: 'Orange',
            },
            {
              color: 'hsl(60, 75%, 60%)',
              label: 'Yellow',
            },
            {
              color: 'hsl(90, 75%, 60%)',
              label: 'Light green',
            },
            {
              color: 'hsl(120, 75%, 60%)',
              label: 'Green',
            },
            {
              color: 'hsl(180, 75%, 60%)',
              label: 'Cyan',
            },
            {
              color: 'hsl(210, 75%, 60%)',
              label: 'Blue',
            },
            {
              color: 'hsl(270, 75%, 60%)',
              label: 'Purple',
            },
          ],
        },
        fontBackgroundColor: {
          colors: [
            {
              color: 'hsl(0, 75%, 60%)',
              label: 'Red',
            },
            {
              color: 'hsl(30, 75%, 60%)',
              label: 'Orange',
            },
            {
              color: 'hsl(60, 75%, 60%)',
              label: 'Yellow',
            },
            {
              color: 'hsl(90, 75%, 60%)',
              label: 'Light green',
            },
            {
              color: 'hsl(120, 75%, 60%)',
              label: 'Green',
            },
            {
              color: 'hsl(180, 75%, 60%)',
              label: 'Cyan',
            },
            {
              color: 'hsl(210, 75%, 60%)',
              label: 'Blue',
            },
            {
              color: 'hsl(270, 75%, 60%)',
              label: 'Purple',
            },
            {
              color: 'hsl(0, 0%, 0%)',
              label: 'Black',
            },
            {
              color: 'hsl(0, 0%, 30%)',
              label: 'Dim grey',
            },
            {
              color: 'hsl(0, 0%, 60%)',
              label: 'Grey',
            },
            {
              color: 'hsl(0, 0%, 90%)',
              label: 'Light grey',
            },
          ],
        },
        link: {
          addTargetToExternalLinks: true,
          defaultProtocol: 'https://',
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties',
          ],
        },
        mediaEmbed: {
          previewsInData: true,
        },
        wordCount: {
          onUpdate: (stats: { characters: number; words: number }) => {
            console.log(
              `Characters: ${stats.characters}\nWords: ${stats.words}`
            )
          },
        },
        placeholder: 'Write your blog here...',
      }}
      onChange={(_event, editor) => {
        const data = editor.getData()
        setEditorData(data)
        handleOnUpdate(data, 'description')
      }}
      onFocus={() => console.log('Editor focused')}
      onBlur={() => console.log('Editor blurred')}
    />
  )
}

export default CkEditor
