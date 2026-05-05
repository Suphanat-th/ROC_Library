import React from "react";
import Image from "next/image";
import { DungeonMapHeaderProps } from "./types";

export default function DungeonMapHeader({
  title,
  description,
  subtitle,
  credits,
  notes = [],
  logoPath,
}: DungeonMapHeaderProps) {
  return (
    <div className="card bg-white shadow-lg mb-4 border border-gray-200">
      <div
        className={`card-body ${logoPath ? "flex flex-col items-center text-center" : ""}`}
      >
        {logoPath && (
          <div className="mb-4">
            <Image
              src={logoPath}
              alt="Logo"
              width={500}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <h1 className="card-title text-3xl font-bold text-gray-900">{title}</h1>

        {subtitle && <p className="text-gray-600 text-base mt-2">{subtitle}</p>}

        {credits && (
          <p className="text-gray-500 text-sm mt-3 italic">*{credits}</p>
        )}
        {(description || notes.length > 0) && (
          <div className="mt-6 space-y-4">
            {/* Description Section */}
            {description && (
              <div className="card shadow-lg bg-base-100">
                <div className="card-body">
                  <div className="text-sm text-gray-800">{description}</div>
                </div>
              </div>
            )}

            {/* Notes Section */}
            {notes.length > 0 && (
              <div className="stats stats-vertical w-full bg-error bg-opacity-10 border border-error">
                {notes.map((note, index) => (
                  <div key={index} className="stat">
                    <div className="stat-title text-error font-semibold">
                      Note {index + 1}
                    </div>
                    <div
                      className="stat-value text-sm text-gray-800"
                      dangerouslySetInnerHTML={{ __html: note }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
