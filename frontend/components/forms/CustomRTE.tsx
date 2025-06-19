import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { IconPhotoPlus, IconVideoPlus } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { Button, Modal, ScrollArea, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Placeholder from '@tiptap/extension-placeholder';

const imgurl = "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/cff84042-5f37-4a99-a78a-5ef3175a2aa6/NEWSLETTER_POST.png?t=1704026995"

function InsertStarControl() {
    const { editor } = useRichTextEditorContext();
    const [opened, { open, close }] = useDisclosure()

    const form = useForm({
        initialValues: {
            src: ''
        },
        validate: {
            src: val => val === '' ? 'Insert image url' : null
        }
    })

    const insertImage = () => {
        const src = form.values.src
        if (src !== '') {
            editor?.chain().focus().setImage({ src }).run()
            close()
        }
    }


    return (
        <>
            <RichTextEditor.Control
                onClick={() => open()}
                aria-label="Insert star emoji"
                title="Insert star emoji"
            >
                <IconPhotoPlus stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
            <Modal title="Add Image" opened={opened} onClose={close} zIndex={2100}>
                <form onSubmit={form.onSubmit(() => insertImage())}>
                    <Stack>
                        <TextInput label="Image URL" radius={'md'} {...form.getInputProps('src')} />
                        <Button size='sm' onClick={insertImage}>Insert</Button>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}

function InsertYoutubeControl() {
    const { editor } = useRichTextEditorContext();
    const [opened, { open, close }] = useDisclosure()

    const form = useForm({
        initialValues: {
            src: ''
        },
        validate: {
            src: val => val === '' ? 'Insert image url' : null
        }
    })

    const insertVideo = () => {
        const src = form.values.src
        if (src !== '') {
            editor?.commands.setYoutubeVideo({
                src: src
            })
            close()
        }
    }


    return (
        <>
            <RichTextEditor.Control
                onClick={() => open()}
                aria-label="Insert star emoji"
                title="Insert star emoji"
            >
                <IconVideoPlus stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
            <Modal title="Add Image" opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(() => insertVideo())}>
                    <Stack>
                        <TextInput label="Youtube Video URL" radius={'md'} {...form.getInputProps('src')} />
                        <Button size='sm' onClick={insertVideo}>Insert</Button>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}

// const content =
//     '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

interface ICustomRTE {
    updateForm?: any
    content: any
    readonly: boolean
    height?: string
}

function CustomRTE(props: ICustomRTE) {
    const { updateForm, content, readonly, height } = props
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            Image,
            Youtube.configure({
                width: 640
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
                placeholder: "Write something here..."
            })
        ],
        editable: !readonly,
        onUpdate: ({ editor }) => {
            const value = editor.getHTML()
            updateForm(value)
        },
        content,
    });

    return (
        <RichTextEditor editor={editor} style={{
            height: readonly ? 'fit-content' : height ?? 'calc(100dvh - 150px)',
            borderRadius: '10px', borderStyle: readonly ? 'none' : 'solid',
        }}
            component={ScrollArea}
        >
            {
                !readonly ? (
                    <RichTextEditor.Toolbar sticky={true} stickyOffset={0}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <InsertStarControl />
                            <InsertYoutubeControl />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                ) : null
            }
            <RichTextEditor.Content />
        </RichTextEditor>
    );
}

export default CustomRTE