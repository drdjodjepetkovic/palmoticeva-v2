"use client";

import { useLanguage } from "@/features/content/context/language-context";
import { Card, CardContent } from "@/components/ui/card";

import type { AboutPageContent } from "@/features/content/data/about";

type TeamProps = {
    team: AboutPageContent['team']
}

export function TeamSection({ team }: TeamProps) {
    const { language } = useLanguage();

    if (!team || !Array.isArray(team.members)) return null;

    return (
        <section className="text-center">
            {team.title?.[language] && <h2 className="text-3xl font-headline font-bold mb-2 text-primary">{team.title[language]}</h2>}
            {team.subtitle?.[language] && <p className="max-w-3xl mx-auto text-muted-foreground mb-12">{team.subtitle[language]}</p>}

            <div className="space-y-8">
                {team.members.map((member, index) => {
                    const name = member.name?.[language];
                    const specialization = member.specialization?.[language];
                    const bio = member.bio?.[language];

                    return (
                        <Card key={index} className="text-left shadow-lg">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="w-32 h-32 flex-shrink-0">
                                    <img src={member.avatar} alt={name} className="w-full h-full object-cover rounded-full border-4 border-primary/20" />
                                </div>
                                <div className="text-center md:text-left flex-grow">
                                    {name && <h3 className="text-xl font-bold">{name}</h3>}
                                    {specialization && <p className="text-primary font-medium mb-4">{specialization}</p>}
                                    {bio && <p className="text-muted-foreground whitespace-pre-line">{bio}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    )
}
