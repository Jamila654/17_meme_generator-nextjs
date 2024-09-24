"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MemeTemplate = {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
};

export default function Home() {
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null | any>(null);
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemes() {
      try {
        const res = await fetch("https://api.imgflip.com/get_memes");
        const data = await res.json();
        if (data.success) {
          setTemplates(data.data.memes);
        } else {
          setError("Failed to fetch meme templates.");
        }
      } catch (err) {
        setError("An error occurred while fetching memes.");
      }
    }
    fetchMemes();
  }, []);

  const generateMeme = async () => {
    if (!selectedTemplate) return;

    const params = new URLSearchParams({
      template_id: selectedTemplate.id,
      text0: topText,
      text1: bottomText,
      username: "jam654",
      password: "28@Clifton",
    });

    try {
      const response = await fetch(`https://api.imgflip.com/caption_image?${params}`);
      const result = await response.json();

      if (result.success && result.data?.url) {
        setGeneratedMemeUrl(result.data.url);
      } else {
        setError("Failed to generate meme.");
      }
    } catch (err) {
      setError("An error occurred while generating meme.");
    }
  };

  const handleDownload = () => {
    if (!generatedMemeUrl) return;
    const link = document.createElement("a");
    link.href = generatedMemeUrl;
    link.download = "generated_meme.png";
    link.click();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {error && <p className="text-red-500">{error}</p>}

        {!selectedTemplate ? (
          <>
            <h1 className="text-xl font-bold">Choose a Meme Template</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`cursor-pointer border-2 ${
                    selectedTemplate?.id === template.id ? "border-blue-500" : ""
                  } p-2`}
                >
                  <Image src={template.url} alt={template.name} width={200} height={200} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-xl font-bold">Selected Meme Template</h2>
              <Image
                src={selectedTemplate.url}
                alt={selectedTemplate.name}
                width={selectedTemplate.width || 200}
                height={selectedTemplate.height || 200}
              />
              <Button onClick={() => setSelectedTemplate(null)}>Choose Another Template</Button>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Create Your Meme</h2>
              <Input
                placeholder="Top Text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
              />
              <Input
                placeholder="Bottom Text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
              />
              <Button onClick={generateMeme}>Generate Meme</Button>
            </div>
          </>
        )}

        {generatedMemeUrl && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold">Your Generated Meme</h2>
            <Image
              src={generatedMemeUrl}
              alt="Generated Meme"
              width={selectedTemplate?.width || 200}
              height={selectedTemplate?.height || 200}
            />
            <Button onClick={handleDownload}>Download Meme</Button>
          </div>
        )}
      </main>
    </div>
  );
}





