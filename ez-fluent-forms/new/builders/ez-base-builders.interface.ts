export interface IEzOptionsProvider<TOptionsBuilder> {
  that(): TOptionsBuilder;
}

export interface IEzParentProvider<TParentBuilder> {
  and(): TParentBuilder;
}

export interface IEzBuildProvider<TBuilt> {
  build(): TBuilt;
}
